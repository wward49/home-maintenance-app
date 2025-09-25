import React, { useRef, useEffect } from "react";
import {View, TouchableOpacity, ScrollView, Text } from "react-native";
import styles from '../styles';

//Contains a list of tasks that are created from user input in the modal panel. Pressing a task on the main screen will highlight it and all days on the calendar that are associated with that task.
//holding down a task button will give users the option to remove the task from the list and delete the colored days from the calendar. 
//Task are arranged in the order they are added to the list, no sort functionality at the moment. Users can scroll through the list when it becomes larger than the container viewport. 
export default function TaskList({
  items = [],
  highlightedTaskIds = [],
  onTaskPress,
  onTaskLongPress,
  autoScroll = true,
}) {
  const scrollRef = useRef(null);
  const prevLen = useRef(items.length);

  useEffect(() => {
    if (!autoScroll) return;

    if (items.length > prevLen.current) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      });
    }
    prevLen.current = items.length;
  }, [items.length, autoScroll]);

  return (
    <View>
      <ScrollView ref={scrollRef}>
        {items.map((task, i) => {
          const isHighlighted = highlightedTaskIds.includes(task.id);
          return (
            <TouchableOpacity
              key={task.id ?? i}
              style={[
                styles.taskItem,
                isHighlighted && styles.taskItemHighlighted,
              ]}
              onPress={() => onTaskPress?.(i, task)}
              onLongPress={() => onTaskLongPress?.(i, task)}
            >
              <Text
                style={[
                  styles.taskItemText,
                  isHighlighted && styles.taskItemTextHighlighted,
                ]}
              >
                {task.taskName || "(Untitled)"} - {task.userRepeatChoice}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}