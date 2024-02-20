---
layout: post
title: Bold Reports Enterprise Edition License Overview
description: This documentation explains about how the license is validated in Bold Reports Enterprise Application.
platform: report-platform
documentation: ug
---

# Enterprise License overview

Starting with the version v2.x, Bold Reports introduced a new licensing system.

## Offline license validation

Starting with the version v2.4.x, Bold Reports introduced an offline licensing system.

We have provided the support to validate the license even when the machine is without an internet connection.

This topic describes how to enable offline license validation in the Bold Reports Enterprise Edition. Follow the given steps:

### Get offline license key file

The offline License key file( `.lic` ) can be generated from the [Downloads](https://www.boldreports.com/account/downloads) section of
the [Bold Reports](https://www.boldreports.com/account) site.

![Offline License](/static/assets/on-premise/images/getting-started/offline-license.png)

### Place offline license key file

Place the downloaded license key file in the Bold Reports installed location. Follow the given steps:

1. The offline license file should have the name `boldreports_components_licensekey.lic`.

2. Go to the deployed location and place the license key file in the below location.

   **`{Deployed Location}`**\app_data\reporting\configuration

   Example: C:\BoldServices\app_data\reporting\configuration

   >By default, Bold Reports will be deployed on C:\BoldServices

3. Restart the Bold Reports application

```steps
The license key will expire based on the validity of the subscription.

After the expiration date, you have to renew and change the license key.
```
