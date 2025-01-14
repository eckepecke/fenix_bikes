import 'package:google_sign_in/google_sign_in.dart';

class GoogleSigninApi {
  static final _clientIDWeb =
      '741042846509-fatvegh9vfr31sd5kv9h4pknaeotvogi.apps.googleusercontent.com';
  static final _googleSignIn = GoogleSignIn(clientId: _clientIDWeb);

  static Future<GoogleSignInAccount?> login() => _googleSignIn.signIn();
}
