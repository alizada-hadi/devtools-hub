import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent } from "@/components/ui/card";
import { QRData } from "./QRGenerator";
import { Globe, Type, Mail, Phone, MessageSquare, Wifi } from "lucide-react";

interface QRInputFormProps {
  qrData: QRData;
  setQRData: (data: QRData) => void;
}

export function QRInputForm({ qrData, setQRData }: QRInputFormProps) {
  const [wifiData, setWifiData] = useState({
    ssid: "",
    password: "",
    security: "WPA",
    hidden: false,
  });

  const updateContent = (content: string) => {
    setQRData({ ...qrData, content });
  };

  const updateType = (type: QRData["type"]) => {
    setQRData({ ...qrData, type, content: "" });
  };

  const formatWifiString = () => {
    return `WIFI:T:${wifiData.security};S:${wifiData.ssid};P:${
      wifiData.password
    };H:${wifiData.hidden ? "true" : "false"};;`;
  };

  const qrTypes = [
    { id: "url", label: "URL", icon: Globe, description: "Website links" },
    { id: "text", label: "Text", icon: Type, description: "Plain text" },
    { id: "email", label: "Email", icon: Mail, description: "Email address" },
    { id: "phone", label: "Phone", icon: Phone, description: "Phone number" },
    {
      id: "sms",
      label: "SMS",
      icon: MessageSquare,
      description: "Text message",
    },
    { id: "wifi", label: "WiFi", icon: Wifi, description: "WiFi credentials" },
  ];

  return (
    <div className="space-y-6">
      {/* Type Selection */}
      <div>
        <Label className="text-sm font-medium mb-3 block">QR Code Type</Label>
        <div className="grid grid-cols-2 gap-3">
          {qrTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  qrData.type === type.id
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => updateType(type.id as QRData["type"])}
              >
                <CardContent className="p-4 text-center">
                  <Icon
                    className={`w-6 h-6 mx-auto mb-2 ${
                      qrData.type === type.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <div className="text-sm font-medium">{type.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {type.description}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Content Input */}
      <div className="space-y-4">
        {qrData.type === "url" && (
          <div>
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={qrData.content}
              onChange={(e) => updateContent(e.target.value)}
              className="mt-1"
            />
          </div>
        )}

        {qrData.type === "text" && (
          <div>
            <Label htmlFor="text">Text Content</Label>
            <Textarea
              id="text"
              placeholder="Enter your text here..."
              value={qrData.content}
              onChange={(e) => updateContent(e.target.value)}
              className="mt-1 min-h-[100px]"
            />
          </div>
        )}

        {qrData.type === "email" && (
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={qrData.content}
              onChange={(e) => updateContent(`mailto:${e.target.value}`)}
              className="mt-1"
            />
          </div>
        )}

        {qrData.type === "phone" && (
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={qrData.content}
              onChange={(e) => updateContent(`tel:${e.target.value}`)}
              className="mt-1"
            />
          </div>
        )}

        {qrData.type === "sms" && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="sms-phone">Phone Number</Label>
              <Input
                id="sms-phone"
                type="tel"
                placeholder="+1234567890"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="sms-message">Message (Optional)</Label>
              <Textarea
                id="sms-message"
                placeholder="Enter your message..."
                className="mt-1"
                onChange={(e) => {
                  const phone =
                    (document.getElementById("sms-phone") as HTMLInputElement)
                      ?.value || "";
                  updateContent(
                    `sms:${phone}?body=${encodeURIComponent(e.target.value)}`
                  );
                }}
              />
            </div>
          </div>
        )}

        {qrData.type === "wifi" && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
              <Input
                id="wifi-ssid"
                placeholder="My WiFi Network"
                value={wifiData.ssid}
                onChange={(e) => {
                  const newWifiData = { ...wifiData, ssid: e.target.value };
                  setWifiData(newWifiData);
                  updateContent(formatWifiString());
                }}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="wifi-password">Password</Label>
              <Input
                id="wifi-password"
                type="password"
                placeholder="Enter password"
                value={wifiData.password}
                onChange={(e) => {
                  const newWifiData = { ...wifiData, password: e.target.value };
                  setWifiData(newWifiData);
                  updateContent(formatWifiString());
                }}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="wifi-security">Security Type</Label>
              <Select
                value={wifiData.security}
                onValueChange={(value) => {
                  const newWifiData = { ...wifiData, security: value };
                  setWifiData(newWifiData);
                  updateContent(formatWifiString());
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">Open Network</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
