---
title: PageLines and the California Consumer Privacy Act (CCPA)
description: The California Consumer Privacy Act, also referred to as CCPA, is a privacy-centric bill aimed at protecting the privacy of California consumers.
---

The California Consumer Privacy Act, also referred to as CCPA, is a privacy-centric bill aimed at protecting the privacy of California consumers. Here we discuss how PageLines addresses the CCPA and how it may affect your application.

## How does the CCPA affect PageLines?

If you are a PageLines customer, under the CCPA you’re considered the ‘business’ and PageLines is the ‘service provider’. As such, we as PageLines are responsible for processing the data our service captures on your site and is stored on our servers. As noted in our [Privacy Policy](/privacy), we will NEVER sell personal data to third parties.

## As a PageLines customer, do I meet the basic requirements of the CCPA?

The CCPA is a large piece of legislation and covers many topics that have no direct impact or tie with your use of PageLines. However, there are areas of the CCPA where your customers might have rights that relate to your use of PageLines. We’ve included a brief explanation of their rights and how PageLines can be used in a manner that supports you in servicing them below.

## 1. Privacy notice

Under the CCPA, businesses must update privacy notices to specifically state what data is collected, categorize the data collected, explain the purpose for the data’s use, identify third parties with which that data is shared, and communicate the rights available to an individual.

We recommend that you perform a full review of your company’s terms of service and privacy policy to ensure you meet the CCPA’s requirements.

## 2. Personal information requests (right of access and deletion)

Under the CCPA, California consumers may have the right to request and receive a list of personal information and additional details a business collects (or has collected), as well as the intended business use for collecting this data.

The consumer may also be able to request that any specific personal information be deleted. With the exception of specific types of data (e.g. billing or other regulatory required information), these deletion requests must be fulfilled by you, the business.

## 3. IP addresses

Under CCPA, an IP address may be considered personal data if it can identify a household.

PageLines’s default behavior is that IP addresses of visitors are always suppressed before being stored to disk on our servers using PageLines's core feature set. We set the last octet of IPv4 addresses (all connections to PageLines are made via IPv4) to 0 to ensure the full IP address is never written to disk. For example, if a visitor's IP address is 1.2.3.4, it will be stored as 1.2.3.0. The first three octets of the IP address are only used to determine the geographic location of the visitor.

Note: IP addresses can optionally be passed to PageLines as a User Attribute. If you, as a PageLines customer, opt to pass IP addresses to PageLines via the Identify API, IP addresses will be stored and might be considered Personal Information under CCPA. Use of the Identify API is optional in PageLines: the feature is not enabled by default and it can be used without passing IP addresses to our servers.

Your privacy and that of your users is a high priority for PageLines. We've built tools to make it easy for you to address requirements with the ever-evolving privacy laws—but if you have any questions with regards to these tools, please contact us at [hello@pagelines.co](mailto:hello@pagelines.co).
