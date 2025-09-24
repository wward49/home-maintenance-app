import React, { useState } from "react";
import { View, Pressable, Text, TextInput } from "react-native";
import styles from '../styles';


export default function MonthlySelector({monthlyRepeat, onChangeGap, dayOfMonth, onChangeDayOfMonth}) {

  return (
    <View>
      <TextInput
        placeholder="Gap"
        style={[styles.inputBox, { marginTop: ".5%", width: "25%" }]}
        keyboardType="numeric"
        value={monthlyRepeat}
        onChangeText={onChangeGap}
      />
      <Text style={styles.repeatTextStyle}> (1-12)</Text>

      <TextInput
        placeholder="Day"
        style={[styles.inputBox, { marginTop: ".5%", width: "25%" }]}
        keyboardType="numeric"
        value={dayOfMonth}
        onChangeText={onChangeDayOfMonth}
      />
      <Text style={styles.repeatTextStyle}> (1-31)</Text>
    </View>
  );
}