import { useState, useEffect } from 'react';
import { getSiteSettings, getSitePlans, verifyAndGenerateVoucher } from '../services/api';

const defaultState = {
  siteName: 'HOG Network',
  logoDataUrl: '/img/logo.png',
  bgDataUrl: '/img/hog-background.jpg',
  whatsAppNumber: '+2349120461800',
  wifiUrl: 'http://192.168.1.253', // Added default WiFi redirect URL
  adminCredentials: {
    username: 'admin',
    password: 'admin123'
  },
  contactEmail: 'admin@hognetwork.com',
  vouchers: [],
  issuedVouchers: [],
  dataPlans: [
    {
      data: '1GB',
      price: 320,
      validity: '24Hours',
      devices: 1,
      upload: 5,
      download: 8,
      showSpeed: true,
      paymentLink: 'https://paystack.shop/pay/asyhox1k9b'
    },
    {
      data: '2GB',
      price: 620,
      validity: '2Days',
      devices: 1,
      upload: 5,
      download: 8,
      showSpeed: true,
      paymentLink: ''
    },
    {
      data: '12GB',
      price: 3400,
      originalPrice: 3600, // Added to show discount badge
      validity: '12Days',
      devices: 1,
      upload: 5,
      download: 8,
      showSpeed: true,
      paymentLink: 'https://paystack.shop/pay/wl5obvswf8'
    },
    {
      data: '20GB',
      price: 5400,
      originalPrice: 5500, // Added to show discount badge
      validity: '30Days',
      devices: 1,
      upload: 5,
      download: 8,
      showSpeed: true,
      paymentLink: 'https://paystack.shop/pay/2w6t3iv586'
    }
  ],
  manualPayment: {
    bankName: 'OPAY BANK',
    accountNumber: '6142233479',
    accountName: 'KIZZY COMMUNICATION LINK'
  },
  paystackPublicKey: '',
  paystackWebhookSecret: '',
  paystackWebhookUrl: '',
  paystackCallbackUrl: '',
  transferApprovalUrl: '',
  notifications: 'Welcome to HOG Network! Please contact admin on WhatsApp after payment for your voucher code.',
  pendingPayments: []
};

export const useAppState = () => {
  const [appState, setAppState] = useState(defaultState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch site settings
        const settingsResponse = await getSiteSettings();
        const settings = settingsResponse.data;

        // Fetch data plans
        const plansResponse = await getSitePlans();
        const plans = plansResponse.data;

        // Transform plans to match current format
        const transformedPlans = plans.map((plan) => ({
          id: plan.id,
          data: plan.dataLimit,
          price: parseFloat(plan.price),
          originalPrice: plan.originalPrice ? parseFloat(plan.originalPrice) : null, // Support for discounts
          validity: plan.validity,
          devices: plan.devices || 1,
          upload: plan.upload || 5,
          download: plan.download || 8,
          showSpeed: typeof plan.showSpeed === 'boolean' ? plan.showSpeed : true,
          paymentLink: plan.paymentLink || '',
          name: plan.name,
          isActive: plan.isActive
        }));

        setAppState((prevState) => ({
          ...prevState,
          siteName: settings.siteName || prevState.siteName,
          logoDataUrl: settings.logoUrl || prevState.logoDataUrl,
          bgDataUrl: settings.backgroundUrl || prevState.bgDataUrl,
          whatsAppNumber: settings.contactPhone || prevState.whatsAppNumber,
          contactEmail: settings.contactEmail || prevState.contactEmail,
          wifiUrl: settings.wifiUrl || prevState.wifiUrl,
          omadaUrl: settings.omadaUrl || prevState.omadaUrl,
          paystackPublicKey: settings.paystackPublicKey || prevState.paystackPublicKey,
          paystackWebhookSecret: settings.paystackWebhookSecret || prevState.paystackWebhookSecret,
          paystackWebhookUrl: settings.paystackWebhookUrl || prevState.paystackWebhookUrl,
          paystackCallbackUrl: settings.paystackCallbackUrl || prevState.paystackCallbackUrl,
          transferApprovalUrl: settings.transferApprovalUrl || prevState.transferApprovalUrl,
          manualPayment: {
            bankName: settings.manualPaymentBankName || prevState.manualPayment.bankName,
            accountNumber: settings.manualPaymentAccountNumber || prevState.manualPayment.accountNumber,
            accountName: settings.manualPaymentAccountName || prevState.manualPayment.accountName
          },
          notifications: settings.notifications || prevState.notifications,
          dataPlans: transformedPlans
        }));
      } catch (err) {
        console.error('Failed to fetch data from API: - useAppState.js:116', err);
        setError('Failed to load data from server. Using cached data.');
        // Keep default state on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addPendingPayment = (payment) => {
    setAppState((prevState) => ({
      ...prevState,
      pendingPayments: [...prevState.pendingPayments, payment]
    }));
  };

  const updateSettings = (newSettings) => {
    setAppState((prevState) => ({
      ...prevState,
      ...newSettings
    }));
  };

  const updateDataPlans = (newPlans) => {
    setAppState((prevState) => ({
      ...prevState,
      dataPlans: newPlans
    }));
  };

  const approvePendingPayment = async (index) => {
    const payment = appState.pendingPayments[index];
    if (!payment) return null;

    try {
      // Call backend/OC300 to generate voucher
      const response = await verifyAndGenerateVoucher({
        paymentReference: payment.paymentReference,
        email: payment.email || payment.phoneNumber || '',
        dataPlan: payment.planName,
        amount: payment.amount,
        oc300ControllerId: payment.oc300ControllerId || ''
      });

      const voucherPayload = response.data?.voucher || {};
      const voucherCode = voucherPayload.code || Math.random().toString(36).substring(2, 15).toUpperCase();

      const voucher = {
        code: voucherCode,
        plan: payment.planName,
        amount: payment.amount,
        phoneNumber: payment.phoneNumber,
        approvedAt: new Date().toISOString(),
        source: 'OC300'
      };

      setAppState((prevState) => ({
        ...prevState,
        pendingPayments: prevState.pendingPayments.filter((_, i) => i !== index),
        issuedVouchers: [...prevState.issuedVouchers, voucher],
        vouchers: [...prevState.vouchers, voucher]
      }));

      return voucher;
    } catch (error) {
      console.error('OC300 voucher generation failed', error);
      // fallback auto-generated code
      const fallbackVoucher = {
        code: Math.random().toString(36).substring(2, 15).toUpperCase(),
        plan: payment.planName,
        amount: payment.amount,
        phoneNumber: payment.phoneNumber,
        approvedAt: new Date().toISOString(),
        source: 'local-fallback'
      };

      setAppState((prevState) => ({
        ...prevState,
        pendingPayments: prevState.pendingPayments.filter((_, i) => i !== index),
        issuedVouchers: [...prevState.issuedVouchers, fallbackVoucher],
        vouchers: [...prevState.vouchers, fallbackVoucher]
      }));

      return fallbackVoucher;
    }
  };

  const rejectPendingPayment = (index) => {
    setAppState((prevState) => ({
      ...prevState,
      pendingPayments: prevState.pendingPayments.filter((_, i) => i !== index)
    }));
  };

  return {
    appState,
    isLoading,
    error,
    addPendingPayment,
    updateSettings,
    updateDataPlans,
    approvePendingPayment,
    rejectPendingPayment
  };
};