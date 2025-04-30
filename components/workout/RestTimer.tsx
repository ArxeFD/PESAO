import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { theme } from '@/constants/theme';
import { X, Play, Pause, RotateCcw } from 'lucide-react-native';
import { Platform } from 'react-native';

type RestTimerProps = {
  onClose: () => void;
  defaultTime: number; // in seconds
};

const { width, height } = Dimensions.get('window');

export default function RestTimer({ onClose, defaultTime }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [isActive, setIsActive] = useState(true);
  const [selectedTime, setSelectedTime] = useState(defaultTime);
  
  const animatedValue = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Start the animation when the timer starts
    startAnimation();
    
    // Set up the timer
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      if (Platform.OS !== 'web') {
        // Vibration.vibrate(2000);
      }
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      if (animation.current) animation.current.stop();
    };
  }, [isActive, timeLeft]);

  const startAnimation = () => {
    // Reset to the starting position
    animatedValue.setValue(0);
    
    // Create the animation
    animation.current = Animated.timing(animatedValue, {
      toValue: 1,
      duration: timeLeft * 1000,
      useNativeDriver: false,
    });
    
    // Start the animation
    animation.current.start();
  };

  const resetTimer = (time: number) => {
    setTimeLeft(time);
    setSelectedTime(time);
    setIsActive(true);
    if (animation.current) animation.current.stop();
    startAnimation();
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive) {
      // Restart the animation from the current position
      animation.current = Animated.timing(animatedValue, {
        toValue: 1,
        duration: timeLeft * 1000,
        useNativeDriver: false,
      });
      animation.current.start();
    } else {
      // Pause the animation
      if (animation.current) animation.current.stop();
    }
  };

  const progressInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2 * Math.PI],
    extrapolate: 'clamp',
  });

  const animatedStyle = {
    transform: [{ rotate: progressInterpolate as any }],
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const presetTimes = [60, 90, 120, 180];

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Rest Timer</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.timerContainer}>
          <View style={styles.timerBackground}>
            <Animated.View style={[styles.timerProgress, animatedStyle]} />
          </View>
          <View style={styles.timerContent}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>remaining</Text>
          </View>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={toggleTimer}
          >
            {isActive ? (
              <Pause size={24} color={theme.colors.textPrimary} />
            ) : (
              <Play size={24} color={theme.colors.textPrimary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => resetTimer(selectedTime)}
          >
            <RotateCcw size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.presets}>
          {presetTimes.map(time => (
            <TouchableOpacity
              key={time}
              style={[
                styles.presetButton,
                selectedTime === time && styles.selectedPreset
              ]}
              onPress={() => resetTimer(time)}
            >
              <Text 
                style={[
                  styles.presetText,
                  selectedTime === time && styles.selectedPresetText
                ]}
              >
                {formatTime(time)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  container: {
    width: width * 0.85,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: theme.colors.textPrimary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  timerBackground: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    borderColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  timerProgress: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    borderLeftColor: theme.colors.primary,
    borderTopColor: theme.colors.primary,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    position: 'absolute',
    transform: [{ rotate: '0deg' }],
  },
  timerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: theme.colors.textPrimary,
  },
  timerLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  presets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  presetButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
  },
  selectedPreset: {
    backgroundColor: theme.colors.primary,
  },
  presetText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  selectedPresetText: {
    color: theme.colors.white,
  },
});