// src/contexts/MessagePopupContext.js
import React, { createContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
//import CommonMessagePopup from '../ui/CommonMessagePopup.js'; // Adjust path if needed

// 1. Create the Context
export const MessagePopupContext = createContext(null);

// 2. Create the Provider Component
export const MessagePopupProvider = ({ children }) => {
    // --- 1. Function for Elegant Alerts (Toasts) ---
  const showMessage = useCallback((message, type = 'info', options) => {
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'info':
        toast(message, options); // Default type for React-Hot-Toast is 'info'
        break;
      case 'warning':
        // React-Hot-Toast doesn't have a direct 'warning' type by default
        // You can style it or use a custom toast, or just use 'info'
        toast(message, {
          icon: '⚠️', // Custom icon for warning
          style: { backgroundColor: '#fffbe6', color: '#856404' }, // Yellowish background
          ...options,
        });
        break;
      default:
        toast(message, options);
    }
  }, []);

  // --- 2. Function for Delete Confirmation Modal ---
  const showConfirm = useCallback(async (title, message, onConfirmCallback, onCancelCallback) => { console.log('showConfirm called with:', title, message, onConfirmCallback, onCancelCallback);
    Modal.confirm({
      title: title,
      icon: <ExclamationCircleFilled style={{ color: '#faad14' }} />, // Yellow exclamation icon
      content: message,
      okText: 'Yes, Proceed',
      okType: 'danger', // Makes the button red
      cancelText: 'Cancel',
      onOk() {
        if (onConfirmCallback) onConfirmCallback();
      },
      onCancel() {
        if (onCancelCallback) onCancelCallback();
      },
      centered: true, // Centers the modal on the screen
    });
  }, []);

  const contextValue = {
    showMessage, // For toasts
    showConfirm, // For confirmation modals
  };

  return (
    <MessagePopupContext.Provider value={contextValue}>
      {children}
    </MessagePopupContext.Provider>
  );
};