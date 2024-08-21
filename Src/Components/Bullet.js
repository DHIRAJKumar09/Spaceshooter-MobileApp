import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Bullet({ position }) {
  return (
    <View style={[styles.bullet, { left: position.x, bottom: position.y }]} />
  );
}

const styles = StyleSheet.create({
  bullet: {
    position: 'absolute',
    width: 5,
    height: 15,
    backgroundColor: 'yellow',
  },
});
