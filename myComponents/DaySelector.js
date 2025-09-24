import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";
import styles from '../styles';


export default function DaySelector({value, onChange}){

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

return(
<View style={styles.daysBoxContainer}>
  {daysOfWeek.map((day) => (
    <Pressable
      key={day}
      style={[
        styles.dayBox,
        value === day && styles.notificationToggleButtonOn,
      ]}
      onPress={() => onChange(day)}
    >
      <Text>{day}</Text>
    </Pressable>
  ))}
</View>
);
}
