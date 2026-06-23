import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { useCartStore } from '@/stores/cartStore';
import { generateOrderId, useOrderStore } from '@/stores/orderStore';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { formatPHP } from '@/utils/format';
import { PAYMENT_METHOD, PAYMENT_METHOD_LABEL } from '@/utils/constants';

type FormErrors = Partial<Record<'name' | 'phone' | 'address', string>>;

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const items = useCartStore((s) => s.items);
  const restaurantId = useCartStore((s) => s.restaurantId);
  const restaurantName = useCartStore((s) => s.restaurantName);
  const subtotal = useCartStore((s) => s.subtotal());
  const deliveryFee = useCartStore((s) => s.deliveryFee());
  const total = useCartStore((s) => s.total());
  const clearCart = useCartStore((s) => s.clearCart);

  const setLastOrder = useOrderStore((s) => s.setLastOrder);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Guard: never allow checkout with an empty cart.
  useEffect(() => {
    if (items.length === 0) router.replace('/');
  }, [items.length, router]);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!name.trim()) next.name = 'Please enter your name.';
    const digits = phone.replace(/\D/g, '');
    if (!phone.trim()) next.phone = 'Please enter your phone number.';
    else if (digits.length < 7) next.phone = 'Please enter a valid phone number.';
    if (!address.trim()) next.address = 'Please enter your delivery address.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = async () => {
    if (submitting) return;
    if (!restaurantId || items.length === 0) return;
    if (!validate()) return;

    setSubmitting(true);

    // Mock-data mode: build a fake order object locally — nothing is sent anywhere.
    const order = {
      id: generateOrderId(),
      restaurantId,
      restaurantName,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      deliveryAddress: address.trim(),
      deliveryNotes: notes.trim() || null,
      items: [...items],
      subtotal,
      deliveryFee,
      total,
      paymentMethod: PAYMENT_METHOD,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await new Promise((resolve) => setTimeout(resolve, 600));

    setLastOrder(order);
    clearCart();
    router.replace('/order-confirmation');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Section step={1} title="Delivery Information">
          <TextField label="Full name" value={name} onChangeText={setName} placeholder="Juan dela Cruz" error={errors.name} />
          <TextField
            label="Phone number"
            value={phone}
            onChangeText={setPhone}
            placeholder="09XX XXX XXXX"
            keyboardType="phone-pad"
            error={errors.phone}
          />
          <TextField
            label="Delivery address"
            value={address}
            onChangeText={setAddress}
            placeholder="House no., street, barangay, landmark"
            multiline
            error={errors.address}
          />
          <TextField
            label="Delivery notes (optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. Leave at the gate, call on arrival"
            multiline
          />
        </Section>

        <Section step={2} title="Payment Method">
          <View style={styles.paymentRow}>
            <View style={styles.radioOuter}>
              <View style={styles.radioInner} />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentLabel}>{PAYMENT_METHOD_LABEL}</Text>
              <Text style={styles.paymentHint}>Pay the rider when your order arrives.</Text>
            </View>
            <Text style={styles.paymentBadge}>Selected</Text>
          </View>
        </Section>

        <Section step={3} title="Order Summary">
          {restaurantName ? <Text style={styles.summaryRestaurant}>{restaurantName}</Text> : null}
          {items.map((item) => (
            <View key={item.menuItemId} style={styles.summaryItem}>
              <Text style={styles.summaryQty}>{item.quantity}×</Text>
              <Text style={styles.summaryItemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.summaryItemPrice}>{formatPHP(item.unitPrice * item.quantity)}</Text>
            </View>
          ))}
          <View style={styles.summaryDivider} />
          <SummaryLine label="Subtotal" value={formatPHP(subtotal)} />
          <SummaryLine label="Delivery fee" value={formatPHP(deliveryFee)} />
          <SummaryLine label="Total" value={formatPHP(total)} emphasize />
        </Section>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          label={submitting ? 'Placing order…' : `Place Order · ${formatPHP(total)}`}
          onPress={placeOrder}
          loading={submitting}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <View style={[styles.section, shadows.soft]}>
      <View style={styles.sectionHeader}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>{step}</Text>
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function SummaryLine({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <View style={styles.summaryLine}>
      <Text style={[styles.summaryLineLabel, emphasize && styles.summaryLineEmph]}>{label}</Text>
      <Text style={[styles.summaryLineValue, emphasize && styles.summaryLineValueEmph]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, gap: spacing.lg },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: { ...typography.captionStrong, color: colors.white },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  sectionBody: { gap: spacing.lg },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: radius.pill, backgroundColor: colors.primary },
  paymentInfo: { flex: 1 },
  paymentLabel: { ...typography.title, color: colors.textPrimary },
  paymentHint: { ...typography.caption, color: colors.textMuted },
  paymentBadge: { ...typography.caption, color: colors.success, fontWeight: '700' },
  summaryRestaurant: { ...typography.captionStrong, color: colors.textSecondary },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  summaryQty: { ...typography.captionStrong, color: colors.gold, minWidth: 26 },
  summaryItemName: { ...typography.body, color: colors.textPrimary, flex: 1 },
  summaryItemPrice: { ...typography.body, color: colors.textSecondary },
  summaryDivider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLineLabel: { ...typography.body, color: colors.textSecondary },
  summaryLineValue: { ...typography.body, color: colors.textPrimary },
  summaryLineEmph: { ...typography.h3, color: colors.textPrimary },
  summaryLineValueEmph: { ...typography.h3, color: colors.gold },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
});
