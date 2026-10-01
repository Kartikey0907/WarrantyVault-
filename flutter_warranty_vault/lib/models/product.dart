import 'package:intl/intl.dart';

class Product {
  final String id;
  final String ownerId;
  final String? householdId;
  final String name;
  final String brand;
  final String model;
  final String category;
  final double purchasePrice;
  final String currency;
  final DateTime purchaseDate;
  final String merchant;
  final String? invoiceNumber;
  final String? orderId;
  final String? serialNumber;

  final int returnPeriodDays;
  final DateTime? returnEndDate;
  final bool isNotReturnable;

  final int warrantyDurationMonths;
  final DateTime? warrantyStartDate;
  final DateTime? warrantyEndDate;
  final String warrantyProvider;
  final String warrantyType;
  final bool isLifetimeWarranty;

  final String? receiptUrl;
  final bool hasReceipt;
  final String status;
  final String? notes;

  Product({
    required this.id,
    required this.ownerId,
    this.householdId,
    required this.name,
    required this.brand,
    required this.model,
    required this.category,
    required this.purchasePrice,
    this.currency = 'INR',
    required this.purchaseDate,
    required this.merchant,
    this.invoiceNumber,
    this.orderId,
    this.serialNumber,
    this.returnPeriodDays = 7,
    this.returnEndDate,
    this.isNotReturnable = false,
    this.warrantyDurationMonths = 12,
    this.warrantyStartDate,
    this.warrantyEndDate,
    this.warrantyProvider = 'Manufacturer',
    this.warrantyType = 'Manufacturer warranty',
    this.isLifetimeWarranty = false,
    this.receiptUrl,
    this.hasReceipt = false,
    this.status = 'Active',
    this.notes,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'ownerId': ownerId,
      'householdId': householdId,
      'name': name,
      'brand': brand,
      'model': model,
      'category': category,
      'purchasePrice': purchasePrice,
      'currency': currency,
      'purchaseDate': purchaseDate.toIso8601String(),
      'merchant': merchant,
      'invoiceNumber': invoiceNumber,
      'orderId': orderId,
      'serialNumber': serialNumber,
      'returnPeriodDays': returnPeriodDays,
      'returnEndDate': returnEndDate?.toIso8601String(),
      'isNotReturnable': isNotReturnable,
      'warrantyDurationMonths': warrantyDurationMonths,
      'warrantyStartDate': warrantyStartDate?.toIso8601String(),
      'warrantyEndDate': warrantyEndDate?.toIso8601String(),
      'warrantyProvider': warrantyProvider,
      'warrantyType': warrantyType,
      'isLifetimeWarranty': isLifetimeWarranty,
      'receiptUrl': receiptUrl,
      'hasReceipt': hasReceipt,
      'status': status,
      'notes': notes,
    };
  }

  factory Product.fromMap(Map<String, dynamic> map) {
    return Product(
      id: map['id'] ?? '',
      ownerId: map['ownerId'] ?? '',
      householdId: map['householdId'],
      name: map['name'] ?? '',
      brand: map['brand'] ?? '',
      model: map['model'] ?? '',
      category: map['category'] ?? 'Other',
      purchasePrice: (map['purchasePrice'] as num?)?.toDouble() ?? 0.0,
      currency: map['currency'] ?? 'INR',
      purchaseDate: DateTime.tryParse(map['purchaseDate'] ?? '') ?? DateTime.now(),
      merchant: map['merchant'] ?? '',
      invoiceNumber: map['invoiceNumber'],
      orderId: map['orderId'],
      serialNumber: map['serialNumber'],
      returnPeriodDays: map['returnPeriodDays'] ?? 7,
      returnEndDate: map['returnEndDate'] != null ? DateTime.tryParse(map['returnEndDate']) : null,
      isNotReturnable: map['isNotReturnable'] ?? false,
      warrantyDurationMonths: map['warrantyDurationMonths'] ?? 12,
      warrantyStartDate: map['warrantyStartDate'] != null ? DateTime.tryParse(map['warrantyStartDate']) : null,
      warrantyEndDate: map['warrantyEndDate'] != null ? DateTime.tryParse(map['warrantyEndDate']) : null,
      warrantyProvider: map['warrantyProvider'] ?? 'Manufacturer',
      warrantyType: map['warrantyType'] ?? 'Manufacturer warranty',
      isLifetimeWarranty: map['isLifetimeWarranty'] ?? false,
      receiptUrl: map['receiptUrl'],
      hasReceipt: map['hasReceipt'] ?? false,
      status: map['status'] ?? 'Active',
      notes: map['notes'],
    );
  }

  String get formattedPrice {
    final format = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);
    return format.format(purchasePrice);
  }
}
