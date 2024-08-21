import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Enemy({ position }) {
  return (
    <View style={[styles.enemy, { left: position.x, top: position.y }]} />
  );
}

const styles = StyleSheet.create({
  enemy: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'red',
  },
});
