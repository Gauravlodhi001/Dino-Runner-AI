import { Dino } from '../game/Dino';
import { ObstacleManager } from '../game/ObstacleManager';

export class AIController {

    update(dino: Dino, obstacleManager: ObstacleManager, speed: number) {
        // 1. Find the closest obstacle that is in front of us
        // Sort obstacles by x
        const sortedObstacles = obstacleManager.obstacles.slice().sort((a, b) => a.x - b.x);

        const nextObstacle = sortedObstacles.find(obs => obs.x + obs.width > dino.x);

        if (!nextObstacle) {
            // No obstacles, just chill (or reset duck)
            dino.duck(false);
            return;
        }

        // 2. Identify the target obstacle
        let targetObstacle = nextObstacle;

        // Special Case: High Bird (Passable) masking a dangerous obstacle behind it
        if (targetObstacle.type === 'BIRD') {
            const relativeY = targetObstacle.y - (dino.groundY || dino.y);
            // If High Bird (<= -70, e.g. -90), it's safe.
            // Check if there's another obstacle close behind it.
            if (relativeY < -70) {
                const nextIndex = sortedObstacles.indexOf(targetObstacle);
                if (nextIndex !== -1 && nextIndex < sortedObstacles.length - 1) {
                    const obstacleBehind = sortedObstacles[nextIndex + 1];
                    // If the obstacle behind is close enough to matter (distance from Dino < reactionDistance + fudge factor)
                    const distBehind = obstacleBehind.x - (dino.x + dino.width);
                    // If we are about to clear the high bird, we might need to jump/duck for the next one ASAP.
                    // Let's just treat the one behind as the target if it's within reaction range.
                    const reactionForBehind = speed * 16 + (obstacleBehind.width * 0.5); // Slightly larger buffer
                    if (distBehind < reactionForBehind) {
                        targetObstacle = obstacleBehind;
                        // console.log("Switching target to obstacle behind high bird!");
                    }
                }
            }
        }

        const distanceToObstacle = targetObstacle.x - (dino.x + dino.width);

        // Slight multiplier increase for safety at high speeds (15x instead of 14x)
        const reactionDistance = speed * 15 + (targetObstacle.width * 0.5);

        if (distanceToObstacle < reactionDistance && distanceToObstacle > 0) {
            if (targetObstacle.type === 'BIRD') {
                const relativeY = targetObstacle.y - (dino.groundY || dino.y);

                if (relativeY >= -40) {
                    // Low bird (e.g. -25). Hits legs.
                    dino.duck(false); // Stop ducking first
                    dino.jump();
                } else if (relativeY >= -90) {
                    // Mid bird (e.g. -75). Hits head (at -60). Duck (at -30) is safe.
                    dino.duck(true);
                } else {
                    // High bird (e.g. -110). Safe.
                    dino.duck(false);
                }
            } else {
                // Cactus -> Always Jump
                dino.duck(false); // Stop ducking first
                dino.jump();
            }
        } else {
            // Stop ducking if safe
            dino.duck(false);
        }
    }
}
