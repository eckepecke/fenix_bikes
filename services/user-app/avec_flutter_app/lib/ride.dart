import 'package:avec_flutter_app/home.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class Ride extends StatefulWidget {
  Ride({super.key, required this.bikeID});

  String bikeID;

  @override
  State<Ride> createState() => _RideState();
}

class _RideState extends State<Ride> {
  final myController = TextEditingController();

  void _stopBike() async {
    var bikeID = widget.bikeID;
    print(bikeID);
    final response = await http.post(
      Uri.parse('http://localhost:1337/trip/end'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{'bike_id': bikeID, 'user_id': 'U0011'}),
    );
    if (response.statusCode == 200) {
      print('success! Stopped bike');
      Navigator.pushReplacement(
          context, MaterialPageRoute(builder: (context) => const MyHomePage()));
    } else {
      // If the server returns an error response, throw an exception
      throw Exception('Failed to post data');
    }
    MaterialPageRoute(builder: (context) => const MyHomePage());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Hyr cykel'),
        ),
        body: Center(
          child: Column(
            children: [
              const SizedBox(height: 30),
              Text(' Du reser med cykel ${widget.bikeID}'),
              const SizedBox(height: 30),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                child: ElevatedButton(
                  onPressed: _stopBike,
                  child: const Text('Avsluta resa'),
                ),
              ),
            ],
          ),
        ));
  }
}
