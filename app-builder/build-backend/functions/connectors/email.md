# Email

The email connector sends emails via SMTP by configuring a mail transport once and transmitting messages containing plain text or HTML content alongside any number of attachments.

This connector requires [instance creation](/app-builder/build-backend/functions/connectors.md#instance-creation) before you can interact with an SMTP server, though Heisenware includes a pre-initialized instance out of the box.

{% hint style="info" %}
#### Ready-to-use instance
Heisenware ships with a pre-initialized email instance called `internal-email`. It is always available, letting you call `send` directly.

![](<../../../../.gitbook/assets/image (483).png>)

To send through another mailing system (such as Gmail, Office 365, or a private SMTP server), create a new instance with your server's connection and authentication details.
{% endhint %}

### `create`

Creates a new email client instance by configuring the connection to an SMTP server.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>options</code></td>
      <td><code>host</code></td>
      <td>The hostname or IP address of your SMTP server (such as <code>smtp.gmail.com</code>).</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>port</code></td>
      <td>The port to connect to. Common values include 465 for SMTPS (use with <code>secure: true</code>), 587 for STARTTLS (use with <code>secure: false</code>), or 25 for unencrypted SMTP. Default 587, or 465 if <code>secure</code> is true.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>secure</code></td>
      <td>If true, the connection uses direct SSL/TLS. If false, the connection upgrades to TLS via STARTTLS if the server supports it. Default false.</td>
      <td>boolean</td>
    </tr>
    <tr>
      <td></td>
      <td><code>ignoreTLS</code></td>
      <td>If true (and <code>secure</code> is false), the connector does not use TLS even if the server supports STARTTLS. Default false.</td>
      <td>boolean</td>
    </tr>
    <tr>
      <td></td>
      <td><code>requireTLS</code></td>
      <td>If true (and <code>secure</code> is false), the connection must upgrade to STARTTLS, otherwise the connector does not send the message. Default false.</td>
      <td>boolean</td>
    </tr>
    <tr>
      <td><code>auth</code></td>
      <td><code>user</code></td>
      <td>The username, typically your full email address.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>pass</code></td>
      <td>The password for the email account.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>type</code></td>
      <td>The authentication type: <code>login</code> or <code>oauth2</code>. Default <code>login</code>.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>defaults</code></td>
      <td></td>
      <td>An object merged into every email sent with this instance, such as to set a shared <code>from</code> address.</td>
      <td>object</td>
    </tr>
  </tbody>
</table>

For OAuth2 (`type: oauth2`), provide the standard nodemailer OAuth2 keys in `auth` (such as `clientId`, `clientSecret`, `refreshToken`, and `accessToken`).

{% hint style="info" %}
Right-click the `auth` input and mark it as a secret to mask the password.
{% endhint %}

#### Examples

Example 1: Connecting with STARTTLS (such as Office 365)

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

Example 2: Connecting with direct SSL/TLS

```yaml
# options
host: mail.my-legacy-server.com
port: 465
secure: true
# auth
user: my-user@my-legacy-server.com
pass: another-password
```

#### Output

Returns the email client instance. Throws an error if configuration fails.

### `send`

Composes and sends an email. The function automatically detects whether `content` is HTML or plain text.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>address</code></td>
      <td><code>from</code></td>
      <td>The sender's address, plain (<code>sender@server.com</code>) or formatted (<code>'"Sender Name" &lt;sender@server.com&gt;'</code>). Omit this if the instance defines a default <code>from</code>.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>to</code></td>
      <td>The primary recipient or recipients, provided as a single address, a comma-separated string, or an array of strings.</td>
      <td>string or array</td>
    </tr>
    <tr>
      <td></td>
      <td><code>cc</code></td>
      <td>Carbon copy recipients, using the same formats as <code>to</code>.</td>
      <td>string or array</td>
    </tr>
    <tr>
      <td></td>
      <td><code>bcc</code></td>
      <td>Blind carbon copy recipients, using the same formats as <code>to</code>.</td>
      <td>string or array</td>
    </tr>
    <tr>
      <td><code>subject</code></td>
      <td></td>
      <td>The subject line of the email.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>content</code></td>
      <td></td>
      <td>The body of the email, provided as plain text or HTML.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>attachments</code></td>
      <td><code>filename</code></td>
      <td>The filename shown in the email. Unicode characters are allowed.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>content</code></td>
      <td>The attachment content as a string, Buffer, or stream. For base64 content, add <code>encoding: base64</code>.</td>
      <td>any</td>
    </tr>
    <tr>
      <td></td>
      <td><code>encoding</code></td>
      <td>The encoding of the <code>content</code> value, such as <code>base64</code>.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>path</code></td>
      <td>A file path to the attachment. This streams the file from disk, which is more memory-efficient for large files than <code>content</code>.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>href</code></td>
      <td>A URL to the file. The connector downloads the content from this URL.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>httpHeaders</code></td>
      <td>Optional HTTP headers to pass with the <code>href</code> request, such as an authorization header.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>cid</code></td>
      <td>A unique content ID to embed the attachment as an inline image in the HTML body (for example, <code>&lt;img src="cid:my-image-cid"&gt;</code>).</td>
      <td>string</td>
    </tr>
  </tbody>
</table>

The `attachments` property accepts an array of objects containing the keys listed above. Provide either `content`, `path`, or `href` per attachment.

#### Examples

Example 1: Plain text email

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

Example 2: Attachment from a file path

```yaml
# address
to: 'manager@example.com'
from: 'reports@my-company.com'
# subject
Q3 financial report
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

Example 3: Attachment from a base64 string

```yaml
# address
to: 'client@example.com'
from: 'invoices@my-company.com'
# subject
Your invoice #12345
# content
Your invoice is attached.
# attachments
[
  {
    filename: 'invoice.pdf',
    content: 'JVBERi0xLjQKJ...', # the base64 string
    encoding: 'base64'
  }
]
```

Example 4: HTML email with an inline image

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
    cid: 'logo-image@my-company.com' # this cid must match the src in the HTML
  }
]
```

#### Output

Returns `true` on a successful send. If the send fails, the function logs the error and returns nothing without throwing an error.

### `delete`

Removes the instance and its configured mail transport.

{% hint style="danger" %}
#### Irreversible action
Deleting an instance removes its configuration. To send through that server again, you must trigger `create` anew.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## App Builder example

In the example below, a [form](../../../../build-frontend/widgets/input-widgets/form.md) fills the subject and content, an [upload](../../../../build-frontend/widgets/input-widgets/upload.md) widget provides the attachments, and the recipient address is predefined. A button triggers the `send` function.

<figure><img src="../../../../.gitbook/assets/image (418).png" alt=""><figcaption></figcaption></figure>

This is how the email looks:

<figure><img src="../../../../.gitbook/assets/image (419).png" alt=""><figcaption></figcaption></figure>

## Video demo

{% embed url="https://www.youtube.com/watch?v=G8L-faWSah4" %}
