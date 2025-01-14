import 'package:flutter/material.dart';
import 'map.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'model/user.dart';

// Home page

class MyHomePage extends StatefulWidget {
  MyHomePage({super.key, required this.user});

  GoogleSignInAccount user;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  TextEditingController cityController = TextEditingController();
  City? selectedCity;
  User? fetchedUser;

  @override
  void initState() {
    super.initState();
    _fetchUser();
  }

  Future<void> _fetchUser() async {
    await http.post(
      Uri.parse('http://localhost:1337/auth/app/user'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'userName': widget.user.displayName!,
        'userEmail': widget.user.email
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Fenix'),
        ),
        body: selectedCity == null
            ? Center(
                child: DropdownMenu<City>(
                  initialSelection: City.undecided,
                  controller: cityController,
                  requestFocusOnTap: true,
                  label: const Text('Stad'),
                  onSelected: (City? label) {
                    setState(() {
                      selectedCity = label;
                    });
                  },
                  dropdownMenuEntries:
                      City.values.map<DropdownMenuEntry<City>>((City label) {
                    return DropdownMenuEntry<City>(
                      value: label,
                      enabled: label.label != 'Välj stad...',
                      label: label.label,
                    );
                  }).toList(),
                ),
              )
            : MapPage(
                selectedCity: selectedCity!.label,
                userEmail: widget.user.email),
        endDrawer: Drawer(
            child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            const SizedBox(
              height: 30,
            ),
            const Text(
              'Här kommer mer information',
              textAlign: TextAlign.left,
            ),
            const SizedBox(
              height: 30,
            ),
            Text(widget.user.displayName!),
            const SizedBox(
              height: 30,
            ),
            const Text('Tidigare resor'),
            const SizedBox(
              height: 30,
            ),
            const Text('Byt stad'),
          ],
        )));
  }
}

enum City {
  undecided('Välj stad...'),
  lund('Lund'),
  skelleftea('Skellefteå'),
  solna('Solna');

  const City(this.label);
  final String label;
}
