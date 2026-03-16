import 'package:dio/dio.dart';

void main() async {
  final dio = Dio(BaseOptions(baseUrl: 'http://localhost:5015/api/'));
  
  try {
    final res = await dio.get('RescueTeam');
    final data = res.data;
    print(data);
  } catch (e) {
    print('Error: $e');
  }
}
