import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Result of a GPS lookup.
class LocationResult {
  final double latitude;
  final double longitude;
  final String? address; // human-readable via reverse geocoding

  const LocationResult({
    required this.latitude,
    required this.longitude,
    this.address,
  });

  /// GeoJSON Point format for the backend API.
  Map<String, dynamic> toGeoJson() => {
    'type': 'Point',
    'coordinates': [longitude, latitude], // GeoJSON: [lng, lat]
  };
}

/// Provides GPS access: permission check → get position → reverse geocode.
class LocationService {
  /// Request permission and get current position + address.
  /// Throws a descriptive [String] message if something goes wrong.
  Future<LocationResult> getCurrentLocation() async {
    // 1. Check if location services are enabled
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw 'Vui lòng bật dịch vụ GPS trên thiết bị của bạn.';
    }

    // 2. Check/request permission
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw 'Quyền truy cập vị trí bị từ chối. Vui lòng cấp quyền trong Cài đặt.';
      }
    }
    if (permission == LocationPermission.deniedForever) {
      throw 'Quyền truy cập vị trí bị từ chối vĩnh viễn. Hãy mở Cài đặt để cấp quyền.';
    }

    // 3. Get position (with timeout)
    final position = await Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        timeLimit: Duration(seconds: 15),
      ),
    );

    // 4. Reverse geocode to get address string
    String? address;
    try {
      final placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );
      if (placemarks.isNotEmpty) {
        final p = placemarks.first;
        // Build a Vietnamese-friendly address string
        final parts = [
          p.street,
          p.subLocality,
          p.locality,
          p.administrativeArea,
        ].where((s) => s != null && s.isNotEmpty).toList();
        address = parts.join(', ');
      }
    } catch (_) {
      // Reverse geocoding can fail on emulators — fallback to coordinates
      address = '${position.latitude.toStringAsFixed(5)}, ${position.longitude.toStringAsFixed(5)}';
    }

    return LocationResult(
      latitude: position.latitude,
      longitude: position.longitude,
      address: address,
    );
  }
}

/// Riverpod provider for LocationService.
final locationServiceProvider = Provider<LocationService>((_) => LocationService());
