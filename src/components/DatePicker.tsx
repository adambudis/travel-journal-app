import React, { useState } from "react";
import { View } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Button } from "react-native-paper";

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  mode?: "date" | "time";
}

const DatePicker = ({ date, setDate, mode = "date" }: DatePickerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleConfirm = (selectedDate: Date): void => {
    setIsVisible(false);
    setDate(selectedDate);
  };

  const handleCancel = (): void => {
    setIsVisible(false);
  };

  return (
    <View>
      <Button mode="outlined" onPress={() => setIsVisible(true)}>
        {mode === "date"
          ? `Date: ${date.toLocaleDateString()}`
          : `Date: ${date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`}
      </Button>

      <DateTimePicker
        isVisible={isVisible}
        mode={mode}
        date={date}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default DatePicker;
