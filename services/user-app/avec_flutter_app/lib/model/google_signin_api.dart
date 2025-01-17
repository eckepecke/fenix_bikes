import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class GoogleSigninApi {
  static final _clientIDWeb = dotenv.env['GOOGLE_CLIENT_ID'];
  static final _googleSignIn = GoogleSignIn(clientId: _clientIDWeb);

  static Future<GoogleSignInAccount?> login() => _googleSignIn.signIn();
}
