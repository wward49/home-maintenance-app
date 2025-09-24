import React, { useRef, useEffect } from "react";
import {View, TouchableOpacity, ScrollView, Text } from "react-native";
import styles from '../styles';


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