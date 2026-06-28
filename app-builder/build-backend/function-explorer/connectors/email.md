# Email

The `Email` class provides a robust interface for sending emails using the **SMTP protocol**. It simplifies the process of configuring a mail transport, defining message options, and sending emails with various types of content and attachments.

{% hint style="info" %}
Heisenware ships with a pre-initialized email instance, which you can directly use without calling `create`. The instance is called `internal-email` and is always available:\
\
![](<../../../../.gitbook/assets/image (483).png>)

In case you want to connect to another mailing system, you have to create an instance first and configure it with the connection and authentication details for your specific email server (e.g., Gmail, Office 365, or a private SMTP server).
{% endhint %}

### create

Creates a new email client instance by configuring and establishing a connection (or connection pool) to an SMTP server.

**Parameters**

* `options`: An object defining the server connection details.
  * `host`: The hostname or IP address of your SMTP server (e.g., `smtp.gmail.com`).
  * `port`: The port to connect to. Common values are:
    * `465`: For SMTPS (SMTP over SSL/TLS). Use with `secure: true`.
    * `587`: For SMTP with STARTTLS (the connection starts insecurely and is upgraded to TLS). Use with `secure: false`.
    * `25`: The default SMTP port, often used for unencrypted connections.
  * `secure`: A boolean. If `true`, the connection uses direct SSL/TLS. If `false` (the default), it attempts to upgrade the connection using STARTTLS if the server supports it.
* `auth`: An object containing the authentication credentials.
  * `user`: The username, which is typically your full email address.
  * `pass`: The password for the email account.
* `defaults`: An optional object to specify default values for all emails sent with this instance. This is very useful for setting a consistent `from` address.

**Example 1: Connecting to a standard SMTP server with STARTTLS (e.g., Office 365)**

```yaml
# options
host: smtp.office365.com
port: 587
secure: false
# auth
user: my-user@my-company.com
pass: my-secret-password
# defaults
from: '"My Application" <my-user@my-company.com>'

```

**Example 2: Connecting to a server requiring direct SSL/TLS (e.g., older configurations)**

```yaml
# options
host: mail.my-legacy-server.com
port: 465
secure: true
# auth
user: my-user@my-legacy-server.com
pass: another-password

```

### send

Composes and sends an email. This function automatically detects if the `content` is HTML or plain text.

**Parameters**

* `address`: An object defining the email recipients.
  * `from`: The sender's email address. Can be a simple address (`'sender@server.com'`) or a formatted string (`'"Sender Name" <sender@server.com>'`).
  * `to`: The primary recipient(s). Can be a single email string, a comma-separated string of emails, or an array of strings.
  * `cc`: Carbon copy recipient(s).
  * `bcc`: Blind carbon copy recipient(s).
* `subject`: The subject line of the email.
* `content`: The body of the email. Can be a plain text string or an HTML string.
* `attachments`: An optional array of attachment objects.

**Attachment Object Properties**

Each object in the `attachments` array can have the following properties:

* `filename`: The name of the file as it will appear in the email.
* `content`: The content of the attachment, typically as a **base64 encoded string**.
* `path`: The local file path to the attachment. This is more memory-efficient for large files as it streams the file from disk.
* `href`: A URL to the file. Nodemailer will download the content from the URL.
* `cid`: A unique Content-ID string. This is used to embed the attachment as an inline image within the HTML body (e.g., `<img src="cid:my-image-cid">`).

Output

Returns true on a successful send.

**Examples**

**Example 1: Sending a simple plain text email**

```yaml
# address
to: 'recipient@example.com'
from: '"Support Team" <support@my-company.com>'
# subject
Your recent support ticket
# content
Hello,

This is a confirmation that we have received your support ticket. We will get back to you shortly.

Regards,
The Support Team

```

**Example 2: Sending an HTML email**

```yaml
# address
to: 'customer@example.com'
from: '"Sales" <sales@my-company.com>'
# subject
Your Weekly Newsletter
# content
'<h1>Our Top Story This Week</h1><p>Check out our latest product, now available for pre-order!</p><a href="https://my-company.com/products/new">Pre-order Now</a>'

```

**Example 3: Sending an email with an attachment from a file path**

```yaml
# address
to: 'manager@example.com'
from: 'reports@my-company.com'
# subject
Q3 Financial Report
# content
Please find the Q3 financial report attached.
# attachments
[
  {
    filename: 'Q3-Report.pdf',
    path: '/path/to/local/reports/q3_financials.pdf'
  }
]

```

**Example 4: Sending an email with an attachment from a base64 string**

```yaml
# address
to: 'client@example.com'
from: 'invoices@my-company.com'
# subject
Your Invoice #12345
# content
Your invoice is attached.
# attachments
[
  {
    filename: 'invoice.pdf',
    content: 'JVBERi0xLjQKJ...', # The base64 string
    encoding: 'base64'
  }
]

```

**Example 5: Sending an HTML email with an inline image**

```yaml
# address
to: 'team@example.com'
from: 'marketing@my-company.com'
# subject
Check out our new logo!
# content
'<p>We are excited to unveil our new company logo:</p><img src="cid:logo-image@my-company.com">'
# attachments
[
  {
    filename: 'logo.png',
    path: '/path/to/assets/new_logo.png',
    cid: 'logo-image@my-company.com' # This cid must match the src in the HTML
  }
]

```

### App Builder Example

In the example below, the subject, content and attachments are dynamically filled from a [Form](../../../build-frontend/widgets/input-widgets/form.md) and a [File Upload](../../../build-frontend/widgets/input-widgets/upload.md), while the recipients address is predefined. A button triggers the send function.

<figure><img src="../../../../.gitbook/assets/image (418).png" alt=""><figcaption></figcaption></figure>

This is how the email looks like:

<figure><img src="../../../../.gitbook/assets/image (419).png" alt=""><figcaption></figcaption></figure>

### Demo video

{% embed url="https://www.youtube.com/watch?v=G8L-faWSah4" %}



