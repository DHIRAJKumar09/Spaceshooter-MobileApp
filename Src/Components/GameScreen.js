import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Image } from 'react-native';
import Player from './Player';
import Bullet from './Bullet';
import Enemy from './Enemy';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function GameScreen({ navigation }) {
  const [playerPosition, setPlayerPosition] = useState({ x: screenWidth / 2 - 25 });
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [score, setScore] = useState(0);

  // Spawn enemies at regular intervals
  useEffect(() => {
    const enemyInterval = setInterval(() => {
      setEnemies((prevEnemies) => [
        ...prevEnemies,
        { id: Math.random().toString(), position: { x: Math.random() * (screenWidth - 50), y: 0 } },
      ]);
    }, 1000);

    return () => clearInterval(enemyInterval);
  }, []);

  // Continuously shoot bullets at regular intervals
  useEffect(() => {
    const bulletInterval = setInterval(() => {
      setBullets((prevBullets) => [
        ...prevBullets,
        { position: { x: playerPosition.x + 22.5, y: screenHeight - 120 } }, // Adjusted bullet starting position
      ]);
    }, 300); // Adjust this value to change the bullet shooting speed

    return () => clearInterval(bulletInterval);
  }, [playerPosition]);

  // Update the game state at regular intervals
  useEffect(() => {
    const gameInterval = setInterval(() => {
      // Move bullets
      setBullets((prevBullets) =>
        prevBullets.map((bullet) => ({
          ...bullet,
          position: { x: bullet.position.x, y: bullet.position.y - 10 },
        }))
      );

      // Move enemies
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => ({
          ...enemy,
          position: { x: enemy.position.x, y: enemy.position.y + 5 },
        }))
      );

      // Check for collisions
      bullets.forEach((bullet) => {
        enemies.forEach((enemy) => {
          if (
            bullet.position.y <= enemy.position.y + 50 &&
            bullet.position.x >= enemy.position.x &&
            bullet.position.x <= enemy.position.x + 50
          ) {
            // Add explosion effect
            setExplosions((prevExplosions) => [
              ...prevExplosions,
              { id: Math.random().toString(), position: enemy.position },
            ]);

            // Remove the bullet and the enemy when they collide
            setEnemies((prevEnemies) => prevEnemies.filter((e) => e.id !== enemy.id));
            setBullets((prevBullets) => prevBullets.filter((b) => b !== bullet));
            setScore((prevScore) => prevScore + 1);
          }
        });
      });

      // Remove explosions after a short delay
      setTimeout(() => {
        setExplosions([]);
      }, 500);

      // Check for game over
      enemies.forEach((enemy) => {
        if (enemy.position.y > screenHeight) {
          Alert.alert('Game Over', `Your score: ${score}`, [{ text: 'OK', onPress: () => navigation.navigate('Home') }]);
        }
      });
    }, 100);

    return () => clearInterval(gameInterval);
  }, [bullets, enemies]);

  // Move the player left or right
  const movePlayer = (direction) => {
    setPlayerPosition((prevPosition) => ({
      x: Math.max(0, Math.min(screenWidth - 50, prevPosition.x + direction)),
    }));
  };

  return (
    <View style={styles.container}>
      <Player position={playerPosition} />
      {bullets.map((bullet, index) => (
        <Bullet key={index} position={bullet.position} />
      ))}
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} position={enemy.position} />
      ))}
      {explosions.map((explosion) => (
        <Image
          key={explosion.id}
          source={require('../assets/explosion.png')}
          style={[styles.explosion, { left: explosion.position.x, top: explosion.position.y }]}
        />
      ))}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => movePlayer(-20)} style={styles.controlButton}>
          <Text style={styles.controlButtonText}>Left</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => movePlayer(20)} style={styles.controlButton}>
          <Text style={styles.controlButtonText}>Right</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.score}>Score: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  controlButton: {
    padding: 20,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 18,
  },
  score: {
    position: 'absolute',
    top: 40,
    left: 20,
    color: 'white',
    fontSize: 24,
  },
  explosion: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
});
