/* eslint-disable react/no-unescaped-entities */
import Navbar from "@/components/UI/Navbar/navbar";
import Sidebar from "@/components/UI/Sidebar/sidebar";

export default async function TermsPage() {
  return (
    <section className="bg-cream max-w-full h-full min-h-screen flex flex-col ">
      <Navbar />

      <div className="flex bg-cream flex-1"> 
          <Sidebar/>

        <div className="flex-1 md:ml-[12.5%] mx-auto px-8 pt-24 pb-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-black text-2xl font-normal lg:text-4xl">Terms & Conditions</h1>
            </div>
           
            
          </div>
          <div className="max-w-4xl">
              <div className="text-gray-700 space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-black mb-2">THE RINGS METHOD® TERMS AND CONDITIONS OF SERVICE</h2>
                  <p className="text-lg font-medium">Effective Date: July 7, 2025</p>
                  <p className="text-lg font-bold mt-4">PLEASE READ THIS LEGAL DOCUMENT CAREFULLY. IT GOVERNS YOUR USE OF THE THE RINGS METHOD® WEBSITE, WEB APPLICATION, AND PRODUCTS.</p>
                </div>

                <div className="space-y-4">
                  <p>Welcome to The Rings Method®. To make these Terms and Conditions (hereinafter, the "Terms") easier to read, the website, web application (webapp), content, videos, training guides, and social media pages controlled by The Rings Method® are collectively referred to as the "Service."</p>
                  
                  <p>We, BuAra Entertainment LLC, operating under the trade name The Rings Method® ("we," "us," "our"), provide on-demand video content and guides on mobility, flexibility, strength, coordination, endurance, yoga, and pilates using gymnastic rings. By visiting, registering, browsing, or using the Service in any way, you (as a "user" or "client") accept and agree to be bound by these Terms, which form a binding legal agreement between you and BuAra Entertainment LLC. Your use of the Service is also governed by our Privacy Policy, which is incorporated herein by reference.</p>
                  
                  <p>If you do not wish to be bound by these Terms, you may not access or use the Service.</p>
                </div>

                <hr className="border-gray-400" />

                <div>
                  <h3 className="text-xl font-bold text-black mb-4">1. SAFETY WARNINGS AND MEDICAL & PHYSICAL ACTIVITY DISCLAIMER</h3>
                  <p className="font-bold mb-3">THIS SECTION IS CRUCIAL. YOUR USE OF THE SERVICE IMPLIES ACCEPTANCE OF THESE RISKS.</p>
                  <ul className="space-y-3 list-disc list-inside ml-4">
                    <li><strong>1.1. Nature of the Service.</strong> The Service offers health and fitness information and is designed for educational and entertainment purposes only. The content provided does not substitute for or replace professional medical advice, diagnosis, or treatment.</li>
                    <li><strong>1.2. Mandatory Medical Consultation.</strong> You must consult your physician or another qualified health professional before starting this or any other exercise program to determine if it is right for your needs. This is especially important if you (or your family) have a history of high blood pressure or heart disease, or if you have ever experienced chest pain when exercising, smoke, have high cholesterol, are obese, or have a bone or joint problem that could be made worse by a change in physical activity. Do not use the Service if your doctor or healthcare provider advises against it.</li>
                    <li><strong>1.3. Not Medical Advice.</strong> Nothing stated or posted on the Service is intended to be, and must not be taken to be, the practice of medicine or professional counseling care. The use of information provided through the Service is solely at your own risk.</li>
                    <li><strong>1.4. Assumption of Risk.</strong> You understand and agree that any fitness and physical exercise program carries an inherent risk of physical injury, from minor injuries (strains, sprains) to serious injuries (joint damage, heart attack) and even death. By voluntarily participating in The Rings Method® programs, you knowingly and fully assume all known and unknown risks associated with these activities, even if caused in whole or in part by the action, inaction, or negligence of The Rings Method® or others.</li>
                  </ul>
                </div>

                <hr className="border-gray-400" />

                <div>
                  <h3 className="text-xl font-bold text-black mb-4">2. RISKS ASSOCIATED WITH EQUIPMENT (GYMNASTIC RINGS)</h3>
                  <ul className="space-y-3 list-disc list-inside ml-4">
                    <li><strong>2.1. User Responsibility.</strong> You are solely responsible for the proper installation, maintenance, and use of your gymnastic rings and all their components.</li>
                    <li><strong>2.2. Mandatory Periodic Inspection.</strong> Before EACH training session, it is your responsibility to thoroughly inspect all equipment. Check for any fraying, loose stitches, tears, cracks, or any other signs of wear or damage to the rings, straps, and anchoring systems. If you detect any sign of damage, STOP USING THE EQUIPMENT IMMEDIATELY.</li>
                    <li><strong>2.3. Use of Anchors (Doors, Walls, Ceilings, Bars).</strong> Our rings design may include accessories for anchoring to doors, walls, ceilings, bars, or other structures. The Rings Method® IS NOT RESPONSIBLE for the structural integrity of any anchor point you choose. It is your sole responsibility to ensure that the door, wall, ceiling, beam, bar, or any other structure is strong enough to withstand the forces generated during training. We are not liable for any damage to your property or for injuries resulting from the failure of the anchor point.</li>
                    <li><strong>2.4. Load Limits and Materials.</strong> Although the rings are designed to withstand high loads, we recommend a maximum user weight of 200 kg to ensure an adequate safety margin. Despite high-quality standards, there is an inherent possibility of material failure. The Rings Method® disclaims all liability for injury, damage, or death that may result from a material failure.</li>
                    <li><strong>2.5. Misuse Disclaimer.</strong> The Rings Method® is not liable for any injury, damage, or death resulting from the misuse of the gymnastic rings, including improper installation or incorrect exercise technique.</li>
                  </ul>
                </div>

                <hr className="border-gray-400" />

                <div>
                  <h3 className="text-xl font-bold text-black mb-4">3. ELIGIBILITY AND USE OF THE SERVICE</h3>
                  <ul className="space-y-3 list-disc list-inside ml-4">
                    <li><strong>3.1. Age Requirement.</strong> You must be at least 18 years old, or the age of legal majority in your jurisdiction of residence.</li>
                    <li><strong>3.2. Account Creation.</strong> You agree to provide accurate information and are responsible for safeguarding your password. Sharing your account is strictly prohibited.</li>
                    <li><strong>3.3. Personal Use.</strong> The Service is offered only for your personal, non-commercial use.</li>
                  </ul>
                </div>

                <hr className="border-gray-400" />

                <div>
                  <h3 className="text-xl font-bold text-black mb-4">4. LICENSE TO USE AND RESTRICTIONS</h3>
                  <ul className="space-y-3 list-disc list-inside ml-4">
                    <li><strong>4.1. License.</strong> We grant you a limited, non-transferable, non-exclusive, revocable license to access and use the Service through a compatible web browser for your personal, non-commercial purposes. This license does not grant you the right to download, reproduce, or distribute the content.</li>
                    <li><strong>4.2. Restrictions.</strong> You will not reproduce, redistribute, sell, create derivative works from, decompile, reverse engineer, or disassemble the Service. You will not take any measures to interfere with or damage the Service.</li>
                  </ul>
                </div>

                <hr className="border-gray-400" />

                <div>
                  <h3 className="text-xl font-bold text-black mb-4">5. INTELLECTUAL PROPERTY</h3>
                  <p>The Service and its original content, features, and functionality are and will remain the exclusive property of BuAra Entertainment LLC and its licensors. The "The Rings Method®" trademark, logos, and all materials are protected by copyright, trademark, and other laws of the United States and foreign countries.</p>
                </div>

                <hr className="border-gray-400" />

                <div>
                  <h3 className="text-xl font-bold text-black mb-4">6. INDEMNIFICATION</h3>
                  <p>You agree to defend, indemnify, and hold harmless BuAra Entertainment LLC, its directors, employees, partners, and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of: (i) your use and access of the Service and equipment; (ii) your violation of any of these Terms; (iii) any injury, death, or property damage caused by your activities; or (iv) third-party claims arising from your activities or your use of the Service.</p>
                </div>

                <hr className="border-gray-400" />

                <div>
                  <h3 className="text-xl font-bold text-black mb-4">7. LIMITATION OF LIABILITY</h3>
                  <p className="font-bold mb-3">TO THE FULLEST EXTENT PERMITTED BY LAW, BUARA ENTERTAINMENT LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:</p>
                  <ul className="space-y-2 list-disc list-inside ml-4">
                    <li>(I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE OR EQUIPMENT;</li>
                    <li>(II) ANY FAILURE OF THE EQUIPMENT;</li>
                    <li>(III) ANY PROPERTY DAMAGE OR DAMAGE TO THIRD PARTIES CAUSED BY THE USER;</li>
                    <li>(IV) ANY PERSONAL INJURY, INCLUDING DEATH.</li>
                  </ul>
                  <p className="mt-3 font-bold">THE TOTAL AGGREGATE LIABILITY OF BUARA ENTERTAINMENT LLC TO YOU FOR ALL CLAIMS SHALL NOT EXCEED THE AMOUNT YOU HAVE PAID US IN THE PAST 12 MONTHS.</p>
                </div>

                <hr className="border-gray-400" />

                <div>
                  <h3 className="text-xl font-bold text-black mb-4">8. GOVERNING LAW AND DISPUTE RESOLUTION</h3>
                  <ul className="space-y-3 list-disc list-inside ml-4">
                    <li><strong>8.1. Governing Law.</strong> These Terms shall be governed and construed in accordance with the laws of the State of Florida, United States of America, without regard to its conflict of law provisions.</li>
                    <li><strong>8.2. Mandatory Arbitration and Class Action Waiver.</strong> You and BuAra Entertainment LLC agree that the U.S. Federal Arbitration Act governs the interpretation and enforcement of this section. Any dispute, claim, or controversy arising out of these Terms shall be resolved exclusively through binding, individual arbitration, and not in a class, representative, or consolidated action. YOU AND BUARA ENTERTAINMENT LLC WAIVE THE RIGHT TO A JURY TRIAL OR TO PARTICIPATE IN A CLASS ACTION. The arbitration will be administered by the American Arbitration Association (AAA) under its "Consumer Arbitration Rules" and will be held in Miami, Florida, or by video conference if the parties so agree.</li>
                  </ul>
                </div>

                <hr className="border-gray-400" />

                <div>
                  <h3 className="text-xl font-bold text-black mb-4">9. COPYRIGHT INFRINGEMENT NOTICES (DMCA)</h3>
                  <p>We respect the intellectual property rights of others. If you believe that any content on the Service infringes your copyright, please send a notice in accordance with the Digital Millennium Copyright Act (DMCA) to our copyright agent at legal@theringsmethod.com with the legally required information.</p>
                </div>

                <hr className="border-gray-400" />

                <div>
                  <h3 className="text-xl font-bold text-black mb-4">10. MODIFICATIONS TO THESE TERMS</h3>
                  <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. Your continued use of the Service after such revisions become effective will signify your acceptance of the revised terms.</p>
                </div>

                <hr className="border-gray-400" />

                <div>
                  <h3 className="text-xl font-bold text-black mb-4">11. CONTACT AND ELECTRONIC COMMUNICATIONS</h3>
                  <ul className="space-y-3 list-disc list-inside ml-4">
                    <li><strong>11.1. Contact.</strong> If you have any questions about these Terms, please contact us:
                      <ul className="mt-2 ml-6 space-y-1">
                        <li>• For support inquiries: help@theringsmethod.com</li>
                        <li>• For legal notices: legal@theringsmethod.com</li>
                        <li>• Mailing Address: BuAra Entertainment LLC, 3745 NE 171ST STREET UNIT 77, NORTH MIAMI BEACH, FL 33160, USA.</li>
                      </ul>
                    </li>
                    <li><strong>11.2. Electronic Communications.</strong> By using our Service, you consent to receive communications from us electronically, such as emails or notices posted on the website. You agree that all agreements, notices, disclosures, and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.</li>
                  </ul>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
‍

Restrictions. Except as expressly permitted in writing by an authorized representative of pliability, you will not reproduce, redistribute, sell, transfer, create derivative works from, decompile, reverse engineer, or disassemble the pliability Application or Service, nor will you take any measures to interfere with or damage the pliability Application or Service. Unless otherwise specified, copying or modifying any Content or using Content for any purpose other than your personal, non-commercial use of the pliability Application or Service, including use of any such Content on any other website or networked computer environment, is strictly prohibited. All rights not expressly granted by pliability in these Terms are reserved.

‍

Password Sharing Prohibited. Membership is personal and non-transferable to another person.  A subscriber to pliability Services may not share his or her account and/or password with any other person.

‍

Accessing App from an App Store.
The following terms apply to any App accessed through or downloaded from any app store or distribution platform (like the Apple App Store or Google Play) where the App may now or in the future be made available (each an "App Provider"). You acknowledge and agree that:

‍

These Terms are between you and pliability, and not with the App Provider, and pliability (not the App Provider), is solely responsible for the App.
The App Provider has no obligation to furnish any maintenance and support services with respect to the App.
In the event of any failure of the App to conform to any applicable warranty, you may notify the App Provider, and the App Provider will refund the purchase price for the App to you (if applicable) and, to the maximum extent permitted by applicable law, the App Provider will have no other warranty obligation whatsoever with respect to the App. Any other claims, losses, liabilities, damages, costs, or expenses attributable to any failure to conform to any warranty will be the sole responsibility of pliability.
The App Provider is not responsible for addressing any claims you have or any claims of any third party relating to the App or your possession and use of the App, including, but not limited to:
product liability claims;
any claim that the App fails to conform to any applicable legal or regulatory requirement; and
claims arising under consumer protection or similar legislation.
In the event of any third-party claim that the App or your possession and use of that App infringes that third party's intellectual property rights, pliability will be solely responsible for the investigation, defense, settlement, and discharge of any such intellectual property infringement claim to the extent required by these Terms.
The App Provider and its affiliates are third-party beneficiaries of these Terms as related to your license to the App, and that, upon your acceptance of the Terms, the App Provider will have the right (and will be deemed to have accepted the right) to enforce these Terms as related to your license of the App against you as a third-party beneficiary thereof.
You must also comply with all applicable third-party terms of service when using the App.
‍

Acceptable Use
This Application and Service may only be used within the scope of what they are provided for, under these Terms and applicable law. Users are solely responsible for making sure that their use of this Application and/or the Service violates no applicable law, regulations or third-party rights.

‍

General Prohibitions and pliability’s Enforcement Rights
‍

You agree not to do any of the following:

Use, display, mirror or frame the pliability Service or any individual element within the pliability Service, pliability's name, any pliability trademark, logo or other proprietary information, or the layout and design of any page or form contained on a page, without pliability's express written consent;
Access, tamper with, or use non-public areas of the pliability Service, pliability's computer systems, or the technical delivery systems of pliability's providers;
Attempt to probe, scan or test the vulnerability of any pliability system or network or breach any security or authentication measures;
Avoid, bypass, remove, deactivate, impair, descramble, or otherwise circumvent any technological measure implemented by pliability or any of pliability's providers or any other third party (including another user) to protect the pliability Service or Content;
Bypass any territorial restrictions, including IP address-based restrictions that may be applied to the pliability Service;
Attempt to access, scrape or search the pliability Service or Content or download Content from the pliability Service, including through the use of any engine, software, tool, agent, device, or mechanism (including spiders, robots, crawlers, data mining tools, plugins, add-ons or the like), other than the software and/or search agents provided by pliability or other generally available third-party web browsers;
Use any meta tags or other hidden text or metadata utilizing a pliability trademark, logo URL, or product name without pliability's express written consent;
Use the pliability Service or Content, or any portion thereof, for any commercial purpose or for the benefit of any third party or in any manner not permitted by these Terms or permitted expressly in writing by pliability;
Attempt to decipher, decompile, disassemble, or reverse engineer any of the software used to provide the pliability Service or Content;
Interfere with, or attempt to interfere with, the access of any user, host or network, including, without limitation, sending a virus, overloading, flooding, spamming, or mail-bombing the pliability Service;
Collect or store any personally identifiable information from the pliability Service from other users of the pliability Service without their express permission;
Copy, use, index, disclose or distribute any information or data obtained from the pliability Service, whether directly or through third parties (such as search engines), without pliability's express written consent;
Alter, replicate, store, distribute, or create derivatives from the Content available via the pliability Service except as expressly permitted in writing by pliability;
Impersonate or misrepresent your affiliation with any person or entity;
Access, use, or exploit the pliability Service in any manner (other than as expressly permitted by these Terms), including to build, develop (or commission the development of), replicate, or consult upon any product or service that may compete (directly or indirectly) with pliability or the pliability Service;
Violate any applicable law or regulation; or
Encourage or enable any other individual to do any of the foregoing.
‍

We have the right to investigate violations of these Terms or conduct that affects the pliability Service. We may also consult and cooperate with law enforcement authorities to prosecute users who violate the law.

‍

Indemnification
You agree to indemnify, defend (including advancement and payment of attorney fees and cost), and hold harmless pliability and its directors, officers, employees, and agents, from and against all claims, damages, losses and costs that arise from or relate to (i) your activities on the pliability Application or Service, and/or (ii) your violation of these Terms.

‍

No Waiver
pliability’s failure to assert any right or provision under these Terms shall not constitute a waiver of any such right or provision. No waiver shall be considered a further or continuing waiver of such term or any other term.

‍

No Warranties
pliability reserves the right to modify the pliability Service, including, but not limited to updating, adding to, enhancing, modifying, removing or altering any Content or features of the pliability Service, at any time, in its sole discretion. You are responsible for providing your own access (e.g., computer, mobile device, Internet connection, etc.) to the pliability Service. Pliability has no obligation to screen or monitor any Content and does not guarantee that any Content available on the pliability Service is suitable for all users or that it will continue to be available for any length of time.

‍

Pliability makes no representations or warranties:

‍

That the pliability Service is or will be permitted in your jurisdiction;
That the pliability Service will be uninterrupted or error-free;
Concerning any Content;
That the pliability Service will meet your personal or professional needs;
That pliability will continue to support any particular feature of the pliability Service; or
Concerning sites and resources outside of the pliability Service, even if linked to from the pliability Service.
To the extent that another party may have access to or view Content on your device, you are solely responsible for informing such party of all disclaimers and warnings in these Terms. TO THE EXTENT ANY DISCLAIMER OR LIMITATION OF LIABILITY DOES NOT APPLY, TO THE FULLEST EXTENT PERMITTED BY LAW, ALL APPLICABLE EXPRESS, IMPLIED, AND STATUTORY WARRANTIES WILL BE LIMITED IN DURATION TO A PERIOD OF 30 DAYS AFTER THE DATE ON WHICH YOU FIRST USED THE PLIABILITY SERVICE, AND NO WARRANTIES SHALL APPLY AFTER SUCH PERIOD.

‍

Limitation of Liability
To the fullest extent permitted by law:

pliability shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, including but not limited to damages for loss of profits, economic or pure economic losses, goodwill, use, data, service interruption, computer damage, system failure, inability to use the pliability Service or Content or other intangible losses, even if a limited remedy set forth herein is found to have failed its essential purpose; and
pliability’s total liability to you for all claims, in the aggregate, will not exceed the amount actually paid by you to pliability over the 12 months preceding the date your first claim(s) arose.
‍

Safety Warnings
THE PLIABILITY SERVICE OFFERS HEALTH AND FITNESS INFORMATION AND IS DESIGNED FOR EDUCATIONAL AND ENTERTAINMENT PURPOSES ONLY. YOU SHOULD CONSULT YOUR PHYSICIAN OR GENERAL PRACTITIONER BEFORE BEGINNING A NEW FITNESS PROGRAM. YOU SHOULD NOT RELY ON THIS INFORMATION AS A SUBSTITUTE FOR, NOR DOES IT REPLACE, PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT. IF YOU HAVE ANY CONCERNS OR QUESTIONS ABOUT YOUR HEALTH, YOU SHOULD ALWAYS CONSULT WITH A PHYSICIAN, GENERAL PRACTITIONER OR OTHER HEALTH-CARE PROFESSIONAL. DO NOT DISREGARD, AVOID OR DELAY OBTAINING MEDICAL OR HEALTH RELATED ADVICE FROM YOUR HEALTHCARE PROFESSIONAL BECAUSE OF SOMETHING YOU MAY HAVE READ ON THE PLIABILITY WEBSITE, THE PLIABILITY SERVICE, THE PLIABILITY APPLICATION, OR HEARD THROUGH THE PLIABILITY SOCIAL COMMUNITY/SOCIAL MEDIA/FORA. THE USE OF INFORMATION PROVIDED THROUGH THE PLIABILITY SERVICE IS SOLELY AT YOUR OWN RISK AND IS NOT MEDICAL OR HEALTHCARE ADVICE.

‍

NOTHING STATED OR POSTED ON THE PLIABILITY WEBSITE OR AVAILABLE THROUGH ANY PLIABILITY SERVICE IS INTENDED TO BE, AND MUST NOT BE TAKEN TO BE, THE PRACTICE OF MEDICAL OR COUNSELING CARE. FOR PURPOSES OF THESE TERMS, THE PRACTICE OF MEDICINE AND COUNSELING INCLUDES, WITHOUT LIMITATION, PSYCHIATRY, PSYCHOLOGY, PSYCHOTHERAPY, OR PROVIDING HEALTH CARE TREATMENT, INSTRUCTIONS, DIAGNOSIS, PROGNOSIS OR ADVICE. THE PLIABILITY SERVICE IS CONTINUALLY UNDER DEVELOPMENT AND, TO THE FULL EXTENT PERMITTED BY LAW, PLIABILITY MAKES NO WARRANTY OF ANY KIND, IMPLIED OR EXPRESS, AS TO ITS ACCURACY, COMPLETENESS OR APPROPRIATENESS FOR ANY PURPOSE. IN THAT REGARD, DEVELOPMENTS IN MEDICAL RESEARCH MAY IMPACT THE HEALTH, FITNESS AND NUTRITIONAL ADVICE THAT APPEARS HERE.

‍

You should consult a physician before starting any fitness activity, including use of the pliability Services.  By using the Services, you are warranting that you are healthy enough to engage in the activities on the Services. pliability reserves the right to refuse or cancel your membership if we determine that you have certain medical conditions or that the representations set forth above are untrue in any respect.

‍

Service Interruption
To ensure the best possible service level, pliability reserves the right to interrupt the Service for maintenance, system updates or any other changes, informing the Users appropriately.  Within the limits of law, pliability may also decide to suspend or discontinue the Service altogether.

‍

Additionally, the Service might not be available due to reasons outside pliability’s reasonable control, such as “force majeure” events (infrastructural breakdowns or blackouts etc.). pliability is not responsible for service interruptions and no refund or partial refund shall be provided in the event of a service interruption.

‍

Service Termination
‍

Term. These Terms begin on the date you first use the pliability Application or Service and continue as long as you have a membership with us and/or continue to use the pliability Application or Service.

‍

Termination. pliability may, in pliability’s sole discretion, suspend, disable, or delete your account (or any part thereof) for any reason, including if pliability determines that you have violated these Terms or that your conduct would tend to damage pliability’s reputation or goodwill. pliability may block your access to the pliability Application and Service to prevent re-registration. If terminated by pliabilitypliaibilty, you may not re-register or otherwise continue to use the Services using a new or false identification.

‍

Effect of Termination / Account Deletion. Upon termination of these Terms all licenses granted by Pliability will terminate. The following sections survive termination:, Indemnification (Section 8), No Warranties (Section 10), Limitation of Liability (Section 11), Safety Warnings (Section 12), Intellectual Property (Section 16), Arbitration Requirement & Class Action Waiver (Section 17), Governing Law and Jurisdiction (Section 18), and all general provisions. If you cancel your membership or it is terminated for any reason, you will lose access to all on-demand content and any other Content or features provided through the pliability Application and Service. pliability, in its sole discretion, may make available a very limited amount of Content or features to non-subscribers from time to time, and any use of that Content is governed by these Terms.

‍

Service Reselling
Users may not reproduce, duplicate, copy, sell, resell or exploit any portion of this Application and of its Service without pliability’s express prior written permission, granted either directly or through a legitimate reselling program.

‍

Intellectual Property Rights
Without prejudice to any more specific provision of these Terms, any intellectual property rights, such as copyrights, trademark rights, patent rights and design rights related to this Application are the exclusive property of pliability or its licensors and are subject to the protection granted by applicable laws or international treaties relating to intellectual property.

‍

All trademarks — nominal or figurative — and all other marks, trade names, service marks, word marks, illustrations, images, or logos appearing in connection with this Application and Service are, and remain, the exclusive property of pliability or its licensors and are subject to the protection granted by applicable laws or international treaties related to intellectual property.

‍

You further acknowledge that the pliability Service contains software and other content that is protected by copyrights, patents, trademarks, trade secrets or other proprietary rights, and that these rights are valid and protected in all forms, media and technologies existing now or hereafter developed.

‍

Arbitration Agreement & Class Action Waiver –  
IMPORTANT – PLEASE REVIEW AS THIS MAY AFFECT YOUR LEGAL RIGHTS. APPLICABLE TO THE FULL EXTENT PERMITTED BY LAW.

‍

1 . Mandatory Arbitration of Disputes. You and pliability each agree that any dispute, claim or controversy arising out of or relating to these Terms or the breach, termination, enforcement, interpretation or validity thereof or the use of the pliability Services, Application, or Content (each, a "Dispute" and collectively, the "Disputes") will be resolved exclusively and solely by binding, individual arbitration, unless expressly provided otherwise in this Section 17, and not in a class, representative or consolidated action or proceeding. You and pliability agree that the U.S. Federal Arbitration Act (or equivalent laws in the jurisdiction in which the pliability entity that you have contracted with is incorporated) governs the interpretation and enforcement of these Terms and that

‍

YOU AND PLIABILITY ARE EACH WAIVING THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN A CLASS, COLLECTIVE OR MASS ACTION.

‍

2 . Exceptions and Opt-out Option. The only exceptions to Section 17 are the following:

‍

you or pliability each may seek to resolve an individual Dispute in small claims court if it qualifies. Both parties must agree to resolution in small claims. Both parties agree that any dispute resolved in small claims shall be decided by a judge and not in any way by a jury.
pliability may seek injunctive or other equitable relief from a court to prevent (or enjoin) the infringement or misappropriation of our respective intellectual property rights.
3 . Initial Dispute Resolution and Notification. You and pliability agree that, prior to initiating an arbitration or other legal proceeding, you and pliability will attempt to negotiate an informal resolution of the Dispute. To begin this process, and before initiating any arbitration or legal proceeding against pliability, you must send a Notice of Dispute ("Notice") by certified mail and email to the attention of pliability’s Legal Department at the pliability address set out in Section 22 of these Terms. For purposes of these Terms, initiating an arbitration means filing an arbitration demand ("Demand").

‍

Your Notice to pliability must contain all of the following information: (1) your full name, address, pliability username, and the email address associated with your pliability account; (2) a detailed description of the nature and basis of the Dispute; (3) a description of the relief you want, including any money damages you request; and (4) your signature verifying the accuracy of the Notice and, if you are represented by counsel, authorizing Peloton to disclose information about you to your attorney.

‍

After receipt of your Notice, you and pliability shall engage in a good-faith effort to resolve the dispute for a period of 60 days, which both sides may extend by written agreement ("Informal Dispute Resolution Period"). During the Informal Dispute Resolution Period, neither you nor pliability may initiate an arbitration or other legal proceeding.

‍

If the Dispute is not resolved during the Informal Dispute Resolution Period, you may initiate an individual arbitration as provided below.

‍

4 . Conducting Arbitration and Arbitration Rules. Any arbitration must be initiated with and conducted by the American Arbitration Association under its Consumer Arbitration Rules. The AAA Rules are available at www.adr.org. In any instance where the applicable AAA Rules and these Terms are inconsistent, these Terms shall control.

‍

An arbitration Demand filed with AAA must include a certification signed by the filing party verifying compliance with the Initial Dispute Resolution and Notification requirements and other requirements set out in this Section 17.

‍

If AAA fails or declines to conduct the arbitration for any reason, we will mutually select a different arbitration administrator. If we cannot agree, a court will appoint the arbitration administrator.

‍

The exclusive venue for any arbitration shall be New York, New York, unless you and pliability agree to a different location.  To the maximum amount possible, the parties agree to use remote platforms such as Zoom to conduct the arbitration.

‍

The arbitrator shall have exclusive authority to decide all issues relating to the interpretation, applicability, enforceability and scope of this arbitration agreement.

‍

5 . Class, Collective and Mass Action Waiver. YOU AND PLIABILITY AGREE THAT, TO THE FULLEST EXTENT PERMITTED BY LAW, EACH OF US MAY BRING CLAIMS (WHETHER IN COURT OR IN ARBITRATION) AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF, CLAIMANT, OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE, CONSOLIDATED, COORDINATED, PRIVATE ATTORNEY GENERAL, REQUEST FOR PUBLIC INJUNCTIVE RELIEF, OR REPRESENTATIVE PROCEEDING. This also means that you and pliability may not participate in any class, collective, consolidated, coordinated, private attorney general, request for public injunctive relief, or representative proceeding brought by any third party. Notwithstanding this provision or any other language in these Terms, you or pliability may participate in a class-wide settlement. TO THE FULLEST EXTENT PERMITTED BY LAW, YOU AND PLIABILITY WAIVE ANY RIGHT TO A JURY TRIAL.

‍

Governing Law and Jurisdiction
All actions arising under and related to these Terms and/or your relationship with pliability for the pliability Service shall be governed by the laws of the State of New York, United States of America, without regard to principles of conflicts of law. You and pliability consent to jurisdiction in the State of New York for any arbitration or other legal proceeding between the parties.

‍

Payment Information & Consent to Emails and Texts
You agree to make all payments to pliability in a timely manner.  If you enroll in an auto-pay program for your monthly subscription, you agree to keep an up-to-date and unexpired credit card on file with pliability.  In addition to U.S. mail, you consent to receive communications from pliability via email and/or text message (you agree to accept all messaging rates), regarding pliability’s Services,  payments due and late payments owed, and reminders to update your credit card information.  You consent to these electronic communications being sent to you without any restriction as to time of day or day of the week.

‍

Modification to These Terms
pliability reserves the right to amend or otherwise modify these Terms at any time. In such cases, pliability will appropriately inform the User of these changes. Such changes will only affect the relationship with the User from the date communicated to Users onwards.

‍

The continued use of the Service will signify the User’s acceptance of the revised Terms. If Users do not wish to be bound by the changes, they must stop using the Service and may terminate the Agreement. The applicable previous version will govern the relationship prior to the User's acceptance. The User can obtain any previous version from pliability.

‍

Assignment of Contract
pliability reserves the right to transfer, assign, dispose of by novation, or subcontract any or all rights or obligations under these Terms. Provisions regarding changes of these Terms will apply accordingly.  Users may not assign or transfer their rights or obligations under these Terms in any way, without the written permission of pliability.

‍

Contacts and Notices
All communications relating to the use of this Application or Service must be sent using the contact information stated below.

‍

You consent to receive all communications including notices, agreements, disclosures, or other information from pliability electronically. Pliability may communicate by U.S. mail, email or by posting to the pliability Service. For support-related inquiries, you may email support@pliability.com.

‍

For all other notices to pliability, including legal notices, you must email notice to both:

‍

support@pliability.com, and

legal@pliability.com

‍

Severability
Should any provision of these Terms be deemed or become invalid or unenforceable under applicable law, the invalidity or unenforceability of such provision shall not affect the validity of the remaining provisions, which shall remain in full force and effect.

Effective February 29, 2024
              </p>
              </div>
        </div>
      </div>
    </section>
  );
}

