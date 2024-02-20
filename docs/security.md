---
layout: post
title: Bold Reports Security – Enterprise Reporting | Bold Reports
description: Learn about the security of Bold Reports Enterprise in terms of authentication, authorization, data security, network security and more.
platform: bold-reports
documentation: ug
---

# Overview of Bold Reports Security

The security is an important aspect of every software. This document explains the important security features such as authentication, authorization, data security, network security, and more provided by Bold Reports Software to the customers.

## Authentication

Authentication verifies the user's identity. Anyone who wants to access and manage the resource such as reports, data source and dataset must be an user of the Bold Reports server. Bold Reports server can be configured to use local authentication or external authentication to validate the authenticity of the users.

### Local authentication

In local authentication, Bold Reports server validates the user authentication by comparing the provided credentials with the details stored in Bold Reports database.

### External authentication

Bold Reports server can be configured with external authentications such as LDAP, Azure ADFS, OpenID, and OAuth.

* LDAP  

Bold Reports server can be configured to use LDAP for user authentication. Users are authenticated by submitting their credentials to Bold Reports server, which will then attempt to bind to the LDAP instance using the user credentials. If the bind works and the credentials are valid, the server grants the user a session.

* Azure ADFS  

Bold Reports server can be configured to use Azure Active Directory for importing users into Bold Reports server and validating their authentication. Users will be logged into Bold Reports server after validated and authenticated by the Microsoft by providing their credentials.

* OpenID connect  

OpenID connect is a simple identity layer on top of the OAuth 2.0 protocol. It allows client to login to Bold Reports application after logged into their identity provider. You should configure the OpenID connect with Bold Reports application to use OpenID connect with Bold Reports server.

* OAuth connect  

Bold Reports supports OAuth 2.0 authorization code workflow for authorizing the third-party application users logging into Bold Reports application. It allows client to login to Bold Reports application after logged into their identity provider. You should configure OAuth 2.0 in Bold Reports application to use OAuth connect with Bold Reports server.

## Authorization

Authorization refers to which resources such as reports, data sources or datasets, the users can access on Bold Reports server after authentication has been verified.
Authorization includes:
* What users are allowed to create new report or manage existing reports.
* What users are allowed to create new data sources or manage existing data sources.
* What users are allowed to create new datasets or manage existing datasets.
* What users are allowed to create new schedules or manage existing schedules.
* What users are allowed to perform admin roles on Bold Reports for creating tenant, adding the users, and configuring the server settings.

## Data security

Bold Reports provides support to control which users can see the reports, data sources and datasets. For data sources that are connected to live databases, you can also control the users based on their permissions. There are read, write, create, and delete permissions that can be assigned to users and groups. Without the read permission, no user could see your data source, dataset and reports.

### Within the tenant

Bold Reports server provides the flexible permission system. Using this, you can control the access to report, data source and dataset.

### Between the tenants

Every tenant user can only login to their tenant and access the resource. Each tenant has been deployed with its own database and resource, which ensures that one tenant data is not shared with other tenant. Also, users belong to one tenant can only see the users belong to the same tenant and share a report to that tenant users. Users must have permissions to view and access the report and resources created by another user on same tenant.

## Application security

Every Bold Reports product installation will generate unique private keys in customer machine. These private keys will be used to encrypt and store the sensitive data such as password and database details.
Bold Reports server uses the following encryptions to encrypt the secure information such as user password and database details.
* `Rijndael Encryption (256 bits)`
* `RSA Cryptography (1024 bits)`
* `AES Cryptography (128 bits)`

## Network security

Bold Reports server provides the following network security.

### Client to Bold Reports server

By default, the Bold Reports server is configured with HTTP protocol, you should change the protocol to HTTPS by configuring SSL in Bold Reports server. We recommend configuring Bold Reports server for HTTPS for all communications. When Bold Reports is configured for SSL, all content and communications between clients are encrypted using SSL, and the HTTPS protocol is used for requests and responses.

### Resource access REST API

Bold Reports server make the internal API call to access resource in web and mobile apps. The Bold Reports server will accept all the connections that uses Transport Layer Security (TLS 1/1.1/1.2) encryption, but we recommend mandatory use of TLS 1.2 in Bold Reports installed server.

### Bold Reports server to database

Bold Reports server can be connected to the database without SSL, but all the database connections support SSL offer encrypted data transfer. We recommend enable the SSL connection to your database while configuring the Bold Reports server.

### Application logging

Bold Reports server will generate log files when user interacts with the Bold Reports application or an exception occurs.
1. Debug log
2. Error log

These logs will only include event performed, error occurred, and other operational logs, and will never collect any confidential information such as user password and database details. These logs will be requested by our support team to check the customer reported issue and provide the solution.

## Open source component usage

Bold Reports Software is included with various open source components, which are licensed under the terms of applicable open source license agreements. Our legal team will verify and approve the use of such components in Bold Reports software and also the usages are revisited and reviewed before every release.
