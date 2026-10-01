import 'package:flutter/material.dart';

enum WarrantyState { active, expiringSoon, critical, expired, lifetime, none }

class WarrantyCalculationResult {
  final WarrantyState state;
  final int daysRemaining;
  final String label;
  final Color color;

  WarrantyCalculationResult({
    required this.state,
    required this.daysRemaining,
    required this.label,
    required this.color,
  });
}

class WarrantyCalculator {
  static DateTime calculateEndDate(DateTime startDate, int durationMonths) {
    int year = startDate.year + (startDate.month + durationMonths - 1) ~/ 12;
    int month = (startDate.month + durationMonths - 1) % 12 + 1;
    int day = startDate.day;

    int daysInMonth = DateTime(year, month + 1, 0).day;
    if (day > daysInMonth) day = daysInMonth;

    return DateTime(year, month, day);
  }

  static WarrantyCalculationResult calculateStatus({
    DateTime? endDate,
    bool isLifetime = false,
    String? warrantyType,
  }) {
    if (warrantyType == 'No warranty') {
      return WarrantyCalculationResult(
        state: WarrantyState.none,
        daysRemaining: 0,
        label: 'No warranty',
        color: Colors.grey,
      );
    }

    if (isLifetime) {
      return WarrantyCalculationResult(
        state: WarrantyState.lifetime,
        daysRemaining: 99999,
        label: 'Lifetime Warranty',
        color: const Color(0xFF10B981), // Emerald
      );
    }

    if (endDate == null) {
      return WarrantyCalculationResult(
        state: WarrantyState.none,
        daysRemaining: 0,
        label: 'Warranty Unknown',
        color: Colors.grey,
      );
    }

    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final normalizedEnd = DateTime(endDate.year, endDate.month, endDate.day);
    final days = normalizedEnd.difference(today).inDays;

    if (days < 0) {
      return WarrantyCalculationResult(
        state: WarrantyState.expired,
        daysRemaining: days,
        label: 'Expired ${days.abs()} days ago',
        color: Colors.grey,
      );
    } else if (days <= 7) {
      return WarrantyCalculationResult(
        state: WarrantyState.critical,
        daysRemaining: days,
        label: 'Critical: $days days remaining',
        color: const Color(0xFFEF4444), // Red
      );
    } else if (days <= 30) {
      return WarrantyCalculationResult(
        state: WarrantyState.critical,
        daysRemaining: days,
        label: 'Attention: $days days remaining',
        color: const Color(0xFFF59E0B), // Orange/Amber
      );
    } else if (days <= 90) {
      return WarrantyCalculationResult(
        state: WarrantyState.expiringSoon,
        daysRemaining: days,
        label: 'Expiring soon: $days days',
        color: const Color(0xFFEAB308), // Yellow
      );
    } else {
      return WarrantyCalculationResult(
        state: WarrantyState.active,
        daysRemaining: days,
        label: 'Active: $days days remaining',
        color: const Color(0xFF10B981), // Green
      );
    }
  }
}
