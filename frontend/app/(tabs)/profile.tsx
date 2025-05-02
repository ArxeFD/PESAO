import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { 
  Clock, Settings, ChevronRight, Calculator, Crown, LogOut, 
  Moon, Volume2, MoveRight, Cog, Weight, Ruler
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import PlateCalculator from '@/components/profile/PlateCalculator';

export default function ProfileScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPlateCalculator, setShowPlateCalculator] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://bucketpruebaarseniy.s3.us-east-2.amazonaws.com/ProfilePicture.jpg?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAIaCXVzLWVhc3QtMiJGMEQCIDh%2BPAvuUrvaE02WDeXvz6qZGhGnT0inUzbhUUDjwxMhAiBO66a0LX2jTVuEm%2ByVvSlfVmx7Jr0JK%2BVW1IJV9ze33CqCAwib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDkyNDk5MTYzMjI1NiIMnTClIwJkemSTtTnJKtYC9Mmjk6Ye%2BH0p4xBQZwbLrVIxPx0B0WD6eaF%2FbJTdTHmApMEYArVytpK0dKH%2FTri47afivbtSTQNr%2BgV2yfqYQlgb11Kk5yPrPT8GTt2YZsCj6eccmNIMkegvzWw6Lj2C4Jv02ntD%2FOkUcxSJIW5MIG4mwwMvP67pExwm76sjPWZfQQSkW3byHnMWSFLCilJT4Sizmyfy671I2XCK1MyoznQpvpa45%2BeKOn9FPMVjwjjQ%2F3naS6SehsyY6tZ51oqlVycjKyn60mFtGRR5wau%2F%2FN2hDtKLaNgC2bb1ZK2qc3lszmWmjXdqOnAYSw0RTE84UeEKhkY5%2FUTSEmTUkA7f2p%2F1EOgtabNYC595XMgFWGNH%2FDmJjKWwgWhi1sOShdkqgqfLDvEqmd6oAbL1Wyw8Mae6tBy4gdDlBjd33rQEfnK0AkheoomKCfoD%2BVST%2B19h6EqwSnFEMOSExsAGOpACOs4EYNFHg8utltZCOsISbtIzkOxZBnigsL3MWNXFtrbMKvdnJjK1QRF63z9vgLS99RGUHKPo5Ea1sKzmHA7wMChziQU6xXW2%2B7W30I00HF5rXzP0YXnan3nZo1uTG9hd8bUCTBFesJNyZIH4W8wHGn2Bwm8uakSg4f6JmXTvRqxfJEKS6DOdxTxgISznDL7F8%2F7sS%2FkbO8vvIm8rr3ls5H1Vr9v8yj2h%2BAbgwQ5PrEWLJQVbGxAMJyvs%2BygFM%2FYYk%2BZJtesVNyMpu%2F8NwSoNJ7UPNh%2F%2B3HhoQQalff9gKlrdknIqItdQwTdjz9WcCqMH3utof1pCnszCdO%2Bg7a3TH%2FSEe78iUg4hzomIV7aOT8w%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA5OXOMGOAJPLJGYC4%2F20250430%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250430T020357Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=8874eb35e08e336c7608e01a9be05494784610e33e9c0098a2ebb422715bcb4b' }}
            style={styles.profilePhoto}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Arseniy Filippov</Text>
            <Text style={styles.profileStats}>32 workouts · 146 exercises</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bodyMetricsCard}>
          <View style={styles.metricItem}>
            <Weight size={18} color={theme.colors.textSecondary} />
            <Text style={styles.metricLabel}>Weight</Text>
            <Text style={styles.metricValue}>82.5 kg</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Ruler size={18} color={theme.colors.textSecondary} />
            <Text style={styles.metricLabel}>Height</Text>
            <Text style={styles.metricValue}>182 cm</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tools</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setShowPlateCalculator(true)}
          >
            <View style={styles.menuItemIcon}>
              <Calculator size={20} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.menuItemText}>Plate Calculator</Text>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemIcon}>
              <Clock size={20} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.menuItemText}>Rest Timer</Text>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemIcon}>
              <Moon size={20} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.menuItemText}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : theme.colors.card}
              ios_backgroundColor={theme.colors.border}
            />
          </View>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemIcon}>
              <Volume2 size={20} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.menuItemText}>Sound Effects</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : theme.colors.card}
              ios_backgroundColor={theme.colors.border}
            />
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemIcon}>
              <MoveRight size={20} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.menuItemText}>Export Data</Text>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemIcon}>
              <Cog size={20} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.menuItemText}>Advanced Settings</Text>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.upgradeButton}>
            <Crown size={20} color="#FFFFFF" />
            <Text style={styles.upgradeButtonText}>Upgrade to PESAO Pro</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color={theme.colors.danger} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showPlateCalculator && (
        <PlateCalculator onClose={() => setShowPlateCalculator(false)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: theme.colors.textPrimary,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  profileStats: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  editButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  bodyMetricsCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 16,
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.textPrimary,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.card,
    marginBottom: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  upgradeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  upgradeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.white,
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoutButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.danger,
    marginLeft: 8,
  },
});