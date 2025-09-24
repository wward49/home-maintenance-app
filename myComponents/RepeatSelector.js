import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";
import styles from '../styles';


export default function RepeatSelector({selected, onChangeRepeatChoice}){

    const repeatOptions = ['weekly', 'biweekly', 'monthly'];


    return (
      <View>
        {repeatOptions.map((option) => (
          <Pressable
            key={option}
            onPress={() => onChangeRepeatChoice(option)}
            style={[
              styles.repeatStyle,
              selected === option && styles.notificationToggleButtonOn,
            ]}
          >
            <Text style={styles.repeatTextStyle}>{option}</Text>
          </Pressable>
        ))}
      </View>
    );
}