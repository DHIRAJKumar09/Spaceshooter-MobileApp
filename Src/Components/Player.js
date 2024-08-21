import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Player({ position }) {
  return (
    <View style={[styles.player, { left: position.x }]} />
  );
}

const styles = StyleSheet.create({
  player: {
    position: 'absolute',
    bottom: 20,
    width: 50,
    height: 50,
    backgroundColor: 'green',
  },
});
