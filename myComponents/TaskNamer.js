import React, { useState } from "react";
import { View, TextInput, Text } from "react-native";
import styles from '../styles';


export default function TaskNamer({taskName, handleTaskNameInput}){

    return (
      <View>
        <TextInput
          placeholder="Task Name Here"
          value={taskName}
          onChangeText={handleTaskNameInput}
          style={styles.inputBox}
        />
      </View>
    );
}