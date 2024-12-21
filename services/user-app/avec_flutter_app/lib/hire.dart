import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '/ride.dart';

class HireBike extends StatefulWidget {
  const HireBike({super.key});
  @override
  State<HireBike> createState() => _HireBikeState();
}

class _HireBikeState extends State<HireBike> {
  final myController = TextEditingController();
  String _textFieldValue = '';

  void _startBike() async {
    var bikeID = _textFieldValue;
    print(bikeID);
    final response = await http.post(
      Uri.parse('http://localhost:1337/trip/start'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{'bike_id': bikeID, 'user_id': 'U0011'}),
    );
    if (response.statusCode == 200) {
      print('success! Started bike');
      Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => Ride(bikeID: bikeID)),
          (_) => false);
    } else {
      // If the server returns an error response, throw an exception
      throw Exception('Failed to post data');
    }
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
              TextField(
                decoration:
                    const InputDecoration(hintText: 'Skriv in cykelns ID'),
                controller: myController,
                onChanged: (value) {
                  _textFieldValue = value;
                },
                textAlign: TextAlign.center,
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                child: ElevatedButton(
                  onPressed: _startBike,
                  child: const Text('Hyr cykel'),
                ),
              ),
            ],
          ),
        ));
  }
}
