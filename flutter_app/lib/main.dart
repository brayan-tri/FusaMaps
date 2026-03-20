import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'screens/login_screen.dart';

void main() {
  runApp(const FusaMapsApp());
}

class FusaMapsApp extends StatelessWidget {
  const FusaMapsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FusaMaps',
      debugShowCheckedModeBanner: false,
      home: const LoginScreen(),
    );
  }
}

class MapaPage extends StatefulWidget {
  const MapaPage({super.key});

  @override
  State<MapaPage> createState() => _MapaPageState();
}

class _MapaPageState extends State<MapaPage> {
  List<Marker> _paraderos = [];

  @override
  void initState() {
    super.initState();
    _cargarParaderos();
  }

  Future<void> _cargarParaderos() async {
    try {
      final response = await http.get(
        Uri.parse('http://172.18.4.168:3000/api/mapa/paraderos'),
      );
      final data = jsonDecode(response.body);
      if (data['success'] == true) {
        setState(() {
          _paraderos = (data['data'] as List).map((p) {
            return Marker(
              point: LatLng(p['lat'], p['lng']),
              width: 40,
              height: 40,
              child: GestureDetector(
                onTap: () => _mostrarParadero(p),
                child: const Icon(Icons.directions_bus, color: Color(0xFF00B87A), size: 32),
              ),
            );
          }).toList();
        });
      }
    } catch (e) {
      debugPrint('Error cargando paraderos: $e');
    }
  }

  void _mostrarParadero(Map p) {
    showModalBottomSheet(
      context: context,
      builder: (_) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(p['nombre'], style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text('Código: ${p['codigo']}', style: const TextStyle(color: Colors.grey)),
            Text('Dirección: ${p['direccion'] ?? 'No disponible'}'),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('FusaMaps 🚌'),
        backgroundColor: const Color(0xFF00B87A),
        foregroundColor: Colors.white,
      ),
      body: FlutterMap(
        options: const MapOptions(
          initialCenter: LatLng(4.3361, -74.3647),
          initialZoom: 14,
        ),
        children: [
          TileLayer(
            urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          ),
          MarkerLayer(markers: _paraderos),
        ],
      ),
    );
  }
}