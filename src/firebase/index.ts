'use client';

// This file serves as a barrel file for Firebase functionality.
// The main initialization is now handled within FirebaseClientProvider,
// which ensures a robust, singleton-like initialization on the client side.

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
export * from './storage';

// Re-exporting from 'firebase/firestore' to allow for consistent import paths
// for types and functions like `collection`, `doc`, `query`, etc., from a single point.
export * from 'firebase/firestore';
