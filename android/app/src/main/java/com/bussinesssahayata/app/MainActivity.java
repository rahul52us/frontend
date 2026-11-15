package com.bussinesssahayata.app;

import android.graphics.Color;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            if (getBridge() != null && getBridge().getWebView() != null) {
                // Ensure WebView background matches dark theme palette by default to avoid light flash
                getBridge().getWebView().setBackgroundColor(Color.parseColor("#070B14"));
            }
        } catch (Exception ignored) {}
    }
}

