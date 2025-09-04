/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Copy,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  Hash,
} from "lucide-react";
import { toast } from "sonner";

interface DecodedJWT {
  header: any;
  payload: any;
  signature: string;
  valid: boolean;
  expired: boolean;
  error?: string;
}

export default function JWTDecoder() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);

  const decodeJWT = (jwt: string) => {
    try {
      if (!jwt.trim()) {
        setDecoded(null);
        return;
      }

      const parts = jwt.split(".");
      if (parts.length !== 3) {
        throw new Error(
          "Invalid JWT format. JWT must have three parts separated by dots."
        );
      }

      const [headerB64, payloadB64, signature] = parts;

      // Decode header
      const header = JSON.parse(
        atob(headerB64.replace(/-/g, "+").replace(/_/g, "/"))
      );

      // Decode payload
      const payload = JSON.parse(
        atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
      );

      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      const expired = payload.exp ? payload.exp < now : false;

      setDecoded({
        header,
        payload,
        signature,
        valid: true,
        expired,
      });
    } catch (error) {
      setDecoded({
        header: {},
        payload: {},
        signature: "",
        valid: false,
        expired: false,
        error: error instanceof Error ? error.message : "Invalid JWT token",
      });
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const formatJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <>
      <div className="container mx-auto p-6 ">
        <div className="">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  JWT Decoder
                </h1>
                <p className="text-muted-foreground">
                  Decode and analyze JSON Web Tokens with detailed payload
                  inspection
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  JWT Token Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your JWT token here..."
                  value={token}
                  onChange={(e) => {
                    setToken(e.target.value);
                    decodeJWT(e.target.value);
                  }}
                  className="min-h-32 font-mono text-sm"
                />

                {decoded && (
                  <div className="flex gap-2">
                    <Badge variant={decoded.valid ? "default" : "destructive"}>
                      {decoded.valid ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" /> Valid
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1" /> Invalid
                        </>
                      )}
                    </Badge>

                    {decoded.valid && decoded.payload.exp && (
                      <Badge
                        variant={decoded.expired ? "destructive" : "secondary"}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {decoded.expired ? "Expired" : "Active"}
                      </Badge>
                    )}
                  </div>
                )}

                {decoded?.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{decoded.error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Header Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Header
                  {decoded?.valid && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(formatJSON(decoded.header))
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {decoded?.valid ? (
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-64">
                    {formatJSON(decoded.header)}
                  </pre>
                ) : (
                  <div className="text-muted-foreground text-center py-8">
                    Enter a valid JWT token to see the header
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payload Section */}
          {decoded?.valid && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Payload
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(formatJSON(decoded.payload))}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Raw Payload */}
                  <div>
                    <h4 className="font-medium mb-3">Raw Payload</h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-80">
                      {formatJSON(decoded.payload)}
                    </pre>
                  </div>

                  {/* Parsed Claims */}
                  <div>
                    <h4 className="font-medium mb-3">Standard Claims</h4>
                    <div className="space-y-3">
                      {decoded.payload.iss && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Issuer (iss)
                          </label>
                          <p className="text-sm bg-muted p-2 rounded">
                            {decoded.payload.iss}
                          </p>
                        </div>
                      )}

                      {decoded.payload.sub && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Subject (sub)
                          </label>
                          <p className="text-sm bg-muted p-2 rounded">
                            {decoded.payload.sub}
                          </p>
                        </div>
                      )}

                      {decoded.payload.aud && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Audience (aud)
                          </label>
                          <p className="text-sm bg-muted p-2 rounded">
                            {Array.isArray(decoded.payload.aud)
                              ? decoded.payload.aud.join(", ")
                              : decoded.payload.aud}
                          </p>
                        </div>
                      )}

                      {decoded.payload.exp && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Expires At (exp)
                          </label>
                          <p className="text-sm bg-muted p-2 rounded">
                            {formatTimestamp(decoded.payload.exp)}
                          </p>
                        </div>
                      )}

                      {decoded.payload.iat && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Issued At (iat)
                          </label>
                          <p className="text-sm bg-muted p-2 rounded">
                            {formatTimestamp(decoded.payload.iat)}
                          </p>
                        </div>
                      )}

                      {decoded.payload.nbf && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Not Before (nbf)
                          </label>
                          <p className="text-sm bg-muted p-2 rounded">
                            {formatTimestamp(decoded.payload.nbf)}
                          </p>
                        </div>
                      )}

                      {decoded.payload.jti && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            JWT ID (jti)
                          </label>
                          <p className="text-sm bg-muted p-2 rounded">
                            {decoded.payload.jti}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Signature Section */}
          {decoded?.valid && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Signature</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      The signature verification requires the secret key and is
                      not possible in client-side applications. This tool only
                      decodes the token structure.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Signature (Base64)
                    </label>
                    <div className="bg-muted p-4 rounded-lg mt-2">
                      <code className="text-sm break-all">
                        {decoded.signature}
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
