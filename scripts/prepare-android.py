from pathlib import Path
import re

root = Path('android')
manifest = root / 'app/src/main/AndroidManifest.xml'
if not manifest.is_file():
    raise SystemExit('AndroidManifest.xml not found after Capacitor platform generation')

text = manifest.read_text(encoding='utf-8')
pattern = r'(<activity\b(?=[^>]*android:name="\.MainActivity")[^>]*)(>)'
match = re.search(pattern, text)
if not match:
    raise SystemExit('MainActivity declaration not found in AndroidManifest.xml')
attrs = match.group(1)
if 'android:screenOrientation=' not in attrs:
    attrs += ' android:screenOrientation="landscape"'
text = text[:match.start(1)] + attrs + text[match.end(1):]
manifest.write_text(text, encoding='utf-8')

java_files = list((root / 'app/src/main/java').rglob('MainActivity.java'))
kotlin_files = list((root / 'app/src/main/java').rglob('MainActivity.kt'))
if java_files:
    java_files[0].write_text('''package com.cybervoid.survivor;

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    hideSystemUI();
  }
  private void hideSystemUI() {
    getWindow().getDecorView().setSystemUiVisibility(
      View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
      View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
      View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN);
  }
  @Override public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) hideSystemUI();
  }
}
''', encoding='utf-8')
elif kotlin_files:
    raise SystemExit('Generated MainActivity is Kotlin; immersive Java patch skipped. Landscape orientation is configured.')
else:
    raise SystemExit('MainActivity source not found')
print('Android configured: landscape, immersive fullscreen, keep screen on')
