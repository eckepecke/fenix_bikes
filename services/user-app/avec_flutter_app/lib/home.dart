import 'package:flutter/material.dart';
import 'map.dart';

// Home page

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  TextEditingController cityController = TextEditingController();
  City? selectedCity;

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
              ),
        endDrawer: const Drawer(
            child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            SizedBox(
              height: 30,
            ),
            Text(
              'Här kommer mer information',
              textAlign: TextAlign.left,
            ),
            SizedBox(
              height: 30,
            ),
            Text('Användare'),
            SizedBox(
              height: 30,
            ),
            Text('Tidigare resor'),
            SizedBox(
              height: 30,
            ),
            Text('Byt stad'),
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
