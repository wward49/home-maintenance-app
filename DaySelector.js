import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";
import styles from './styles';


export default function DaySelector(){
const[dayOfWeekChoice, setDayOfWeekChoice] = useState('Mon');

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const handleDayPress = (day) =>{

    setDayOfWeekChoice(day);
    console.log(day);
}


return(
<View style={styles.daysBoxContainer}>
  {daysOfWeek.map((day) => (
    <Pressable
      key={day}
      style={[
        styles.dayBox,
        dayOfWeekChoice === day && styles.notificationToggleButtonOn,
      ]}
      onPress={() => handleDayPress(day)}
    >
      <Text>{day}</Text>
    </Pressable>
  ))}
</View>
);
}
