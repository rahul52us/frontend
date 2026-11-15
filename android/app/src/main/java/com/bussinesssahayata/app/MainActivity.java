package com.bussinesssahayata.app;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            Window window = getWindow();
            // Enable edge-to-edge layout so WebView fills the full screen without native gray bars
            WindowCompat.setDecorFitsSystemWindows(window, false);
            window.setStatusBarColor(Color.TRANSPARENT);
            window.setNavigationBarColor(Color.TRANSPARENT);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                window.setNavigationBarContrastEnforced(false);
            }

            window.getDecorView().setBackgroundColor(Color.parseColor("#070B14"));

            if (getBridge() != null && getBridge().getWebView() != null) {
                // Ensure WebView background matches dark theme palette by default to avoid light/gray flash
                getBridge().getWebView().setBackgroundColor(Color.parseColor("#070B14"));
            }
        } catch (Exception ignored) {}
    }
}

