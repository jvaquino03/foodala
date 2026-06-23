import { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { TextField } from '@/components/TextField';
import { HERO_IMAGE } from '@/data/mockRestaurants';
import { useAuthStore } from '@/stores/authStore';
import { colors, spacing, typography } from '@/theme';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const signIn = useAuthStore((s) => s.signIn);
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Mock-only: no validation, no provider — just set state and enter the app.
  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleSignIn = () => {
    signIn(email || 'you@foodala.com');
    router.replace('/');
  };

  const handleGuest = () => {
    continueAsGuest();
    router.replace('/');
  };

  return (
    <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.bg}>
      <LinearGradient
        colors={['rgba(5,5,5,0.55)', 'rgba(5,5,5,0.85)', colors.background]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + spacing.giant, paddingBottom: insets.bottom + spacing.xl },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <Logo size="lg" />
            <Text style={styles.headline}>Premium food,{'\n'}delivered to your door.</Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />

            <Pressable
              onPress={handleSignIn}
              style={styles.forgotWrap}
              hitSlop={8}
              accessibilityRole="link"
            >
              <Text style={styles.forgot}>Forgot Password?</Text>
            </Pressable>

            <Button label="Sign In" onPress={handleSignIn} disabled={!canSubmit} />

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <Button label="Continue as Guest" variant="secondary" onPress={handleGuest} />

            <View style={styles.signupRow}>
              <Text style={styles.signupMuted}>New to Foodala? </Text>
              <Pressable onPress={handleSignIn} hitSlop={8} accessibilityRole="link">
                <Text style={styles.signupLink}>Create Account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, justifyContent: 'space-between' },
  hero: { gap: spacing.xl, marginBottom: spacing.giant },
  headline: { ...typography.h1, color: colors.white },
  form: { gap: spacing.lg },
  forgotWrap: { alignSelf: 'flex-end', marginTop: -spacing.xs },
  forgot: { ...typography.captionStrong, color: colors.gold },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.xs },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { ...typography.overline, color: colors.textMuted },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.sm },
  signupMuted: { ...typography.body, color: colors.textSecondary },
  signupLink: { ...typography.bodyStrong, color: colors.cream },
});
