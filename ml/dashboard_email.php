<?php
/**
 * Filename: dashboard_email.php
 * Location: /web/root/
 * 
 * Admin dashboard for Evil Genius Creative mail system management
 * 
 * Variables:
 * - $emails: Array of recent email submissions from database
 * - $bans: Array of current IP and cookie bans
 * - $form_disabled: Boolean check for form_disabled.flag file
 * - $total_emails, $emails_today, $emails_last_10_min: Statistics counters
 * - $hourly_stats, $top_ips: Analytics data arrays
 * 
 * Features:
 * - View and delete recent emails
 * - Manage IP and cookie bans
 * - Enable/disable contact forms
 * - Real-time statistics and analytics
 * - Manual ban tools
 * 
 * Instructions:
 * 1. Access via yourdomain.com/dashboard_email.php
 * 2. Login required (uses auth.php session)
 * 3. Can re-enable forms disabled by auto-protection
 * 4. Ban management for spam prevention
 * 5. Analytics show traffic patterns for monitoring
 */

require_once 'auth.php';
require_once 'db.php';

// Check if user is logged in, if not redirect to admin.php
if (!($_SESSION['logged_in'] ?? false)) {
    header("Location: admin.php");
    exit;
}

// Handle form actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['enable_form'])) {
        // Re-enable the form
        if (file_exists('form_disabled.flag')) {
            unlink('form_disabled.flag');
        }
        $success = "Form has been re-enabled.";
    }
    
    if (isset($_POST['ban_ip'])) {
        $ip_to_ban = $_POST['ip_address'];
        $reason = $_POST['ban_reason'] ?? 'Admin ban';
        
        $stmt = $pdo->prepare("INSERT INTO bans (ip, reason, banned_at) VALUES (?, ?, NOW())");
        $stmt->execute([$ip_to_ban, $reason]);
        $success = "IP $ip_to_ban has been banned.";
    }
    
    if (isset($_POST['ban_cookie'])) {
        $cookie_to_ban = $_POST['cookie_hash'];
        $reason = $_POST['ban_reason'] ?? 'Admin ban';
        
        $stmt = $pdo->prepare("INSERT INTO bans (cookie_hash, reason, banned_at) VALUES (?, ?, NOW())");
        $stmt->execute([$cookie_to_ban, $reason]);
        $success = "Cookie has been banned.";
    }
    
    if (isset($_POST['unban'])) {
        $ban_id = $_POST['ban_id'];
        $stmt = $pdo->prepare("DELETE FROM bans WHERE id = ?");
        $stmt->execute([$ban_id]);
        $success = "Ban has been removed.";
    }
    
    if (isset($_POST['delete_email'])) {
        $email_id = $_POST['email_id'];
        $stmt = $pdo->prepare("DELETE FROM emails WHERE id = ?");
        $stmt->execute([$email_id]);
        $success = "Email has been deleted.";
    }
}

// Get recent emails
$stmt = $pdo->prepare("SELECT * FROM emails ORDER BY timestamp DESC LIMIT 50");
$stmt->execute();
$emails = $stmt->fetchAll();

// Get current bans
$stmt = $pdo->prepare("SELECT * FROM bans ORDER BY banned_at DESC");
$stmt->execute();
$bans = $stmt->fetchAll();

// Check if form is disabled
$form_disabled = file_exists('form_disabled.flag');

// Get stats
$stmt = $pdo->prepare("SELECT COUNT(*) as total FROM emails");
$stmt->execute();
$total_emails = $stmt->fetch()['total'];

$stmt = $pdo->prepare("SELECT COUNT(*) as today FROM emails WHERE DATE(timestamp) = CURDATE()");
$stmt->execute();
$emails_today = $stmt->fetch()['today'];

$stmt = $pdo->prepare("SELECT COUNT(*) as recent FROM emails WHERE timestamp > DATE_SUB(NOW(), INTERVAL 10 MINUTE)");
$stmt->execute();
$emails_last_10_min = $stmt->fetch()['recent'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Dashboard - Evil Genius Creative</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #eee;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #dee2e6;
        }
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #007bff;
        }
        .stat-label {
            color: #666;
            margin-top: 5px;
        }
        .form-status {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .form-enabled {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .form-disabled {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .section {
            margin: 30px 0;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .section h3 {
            margin-top: 0;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin: 2px;
        }
        .btn-primary {
            background: #007bff;
            color: white;
        }
        .btn-danger {
            background: #dc3545;
            color: white;
        }
        .btn-warning {
            background: #ffc107;
            color: #212529;
        }
        .btn-success {
            background: #28a745;
            color: white;
        }
        .btn:hover {
            opacity: 0.9;
        }
        .message {
            max-width: 300px;
            word-wrap: break-word;
        }
        .success {
            background: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .ban-form {
            display: inline-block;
            margin: 5px;
        }
        .ban-form input[type="text"] {
            width: 100px;
            padding: 4px;
            margin: 2px;
            border: 1px solid #ccc;
            border-radius: 3px;
        }
        .navigation {
            margin-bottom: 20px;
        }
        .navigation a {
            margin-right: 15px;
            color: #007bff;
            text-decoration: none;
        }
        .navigation a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Email Dashboard</h1>
            <div class="navigation">
                <a href="change-password.php">Change Password</a>
                <a href="?logout">Logout</a>
            </div>
        </div>

        <?php if (isset($success)): ?>
            <div class="success"><?= htmlspecialchars($success) ?></div>
        <?php endif; ?>

        <!-- Stats Section -->
        <div class="stats">
            <div class="stat-box">
                <div class="stat-number"><?= $total_emails ?></div>
                <div class="stat-label">Total Emails</div>
            </div>
            <div class="stat-box">
                <div class="stat-number"><?= $emails_today ?></div>
                <div class="stat-label">Today</div>
            </div>
            <div class="stat-box">
                <div class="stat-number"><?= $emails_last_10_min ?></div>
                <div class="stat-label">Last 10 Minutes</div>
            </div>
            <div class="stat-box">
                <div class="stat-number"><?= count($bans) ?></div>
                <div class="stat-label">Active Bans</div>
            </div>
        </div>

        <!-- Form Status -->
        <div class="form-status <?= $form_disabled ? 'form-disabled' : 'form-enabled' ?>">
            <?php if ($form_disabled): ?>
                ⛔ Contact Form is DISABLED
                <form method="post" style="display: inline; margin-left: 15px;">
                    <button type="submit" name="enable_form" class="btn btn-success">Re-enable Form</button>
                </form>
            <?php else: ?>
                ✅ Contact Form is ACTIVE
            <?php endif; ?>
        </div>

        <!-- Recent Emails Section -->
        <div class="section">
            <h3>📬 Recent Emails (Last 50)</h3>
            <?php if (empty($emails)): ?>
                <p>No emails received yet.</p>
            <?php else: ?>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Site</th>
                            <th>IP</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($emails as $email): ?>
                            <tr>
                                <td><?= $email['id'] ?></td>
                                <td><?= htmlspecialchars($email['name']) ?></td>
                                <td><?= htmlspecialchars($email['email']) ?></td>
                                <td class="message"><?= htmlspecialchars(substr($email['message'], 0, 100)) ?><?= strlen($email['message']) > 100 ? '...' : '' ?></td>
                                <td><?= htmlspecialchars($email['site']) ?></td>
                                <td><?= htmlspecialchars($email['ip']) ?></td>
                                <td><?= $email['timestamp'] ?></td>
                                <td>
                                    <!-- Ban IP -->
                                    <form method="post" class="ban-form">
                                        <input type="hidden" name="ip_address" value="<?= $email['ip'] ?>">
                                        <input type="text" name="ban_reason" placeholder="Reason" value="Spam">
                                        <button type="submit" name="ban_ip" class="btn btn-danger">Ban IP</button>
                                    </form>
                                    
                                    <!-- Delete Email -->
                                    <form method="post" class="ban-form">
                                        <input type="hidden" name="email_id" value="<?= $email['id'] ?>">
                                        <button type="submit" name="delete_email" class="btn btn-warning" onclick="return confirm('Delete this email?')">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>

        <!-- Current Bans Section -->
        <div class="section">
            <h3>🚫 Current Bans</h3>
            <?php if (empty($bans)): ?>
                <p>No active bans.</p>
            <?php else: ?>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>IP Address</th>
                            <th>Cookie Hash</th>
                            <th>Reason</th>
                            <th>Banned At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($bans as $ban): ?>
                            <tr>
                                <td><?= $ban['id'] ?></td>
                                <td><?= htmlspecialchars($ban['ip'] ?? 'N/A') ?></td>
                                <td><?= htmlspecialchars(substr($ban['cookie_hash'] ?? 'N/A', 0, 16)) ?>...</td>
                                <td><?= htmlspecialchars($ban['reason']) ?></td>
                                <td><?= $ban['banned_at'] ?></td>
                                <td>
                                    <form method="post" style="display: inline;">
                                        <input type="hidden" name="ban_id" value="<?= $ban['id'] ?>">
                                        <button type="submit" name="unban" class="btn btn-success">Unban</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>

        <!-- Manual Ban Section -->
        <div class="section">
            <h3>⚡ Manual Ban Tools</h3>
            <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                <form method="post" style="flex: 1; min-width: 250px;">
                    <h4>Ban IP Address</h4>
                    <input type="text" name="ip_address" placeholder="IP Address" required style="width: 100%; padding: 8px; margin-bottom: 10px;">
                    <input type="text" name="ban_reason" placeholder="Reason" value="Manual ban" style="width: 100%; padding: 8px; margin-bottom: 10px;">
                    <button type="submit" name="ban_ip" class="btn btn-danger">Ban IP</button>
                </form>
                
                <form method="post" style="flex: 1; min-width: 250px;">
                    <h4>Ban Cookie Hash</h4>
                    <input type="text" name="cookie_hash" placeholder="Cookie Hash" required style="width: 100%; padding: 8px; margin-bottom: 10px;">
                    <input type="text" name="ban_reason" placeholder="Reason" value="Manual ban" style="width: 100%; padding: 8px; margin-bottom: 10px;">
                    <button type="submit" name="ban_cookie" class="btn btn-danger">Ban Cookie</button>
                </form>
            </div>
        </div>

        <!-- Quick Stats Section -->
        <div class="section">
            <h3>📊 Quick Analytics</h3>
            <?php
            // Get hourly breakdown for today
            $stmt = $pdo->prepare("
                SELECT HOUR(timestamp) as hour, COUNT(*) as count 
                FROM emails 
                WHERE DATE(timestamp) = CURDATE() 
                GROUP BY HOUR(timestamp) 
                ORDER BY hour DESC
            ");
            $stmt->execute();
            $hourly_stats = $stmt->fetchAll();
            
            // Get top IPs
            $stmt = $pdo->prepare("
                SELECT ip, COUNT(*) as count 
                FROM emails 
                WHERE timestamp > DATE_SUB(NOW(), INTERVAL 24 HOUR)
                GROUP BY ip 
                ORDER BY count DESC 
                LIMIT 5
            ");
            $stmt->execute();
            $top_ips = $stmt->fetchAll();
            ?>
            
            <div style="display: flex; gap: 30px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 250px;">
                    <h4>Today's Hourly Breakdown</h4>
                    <?php if ($hourly_stats): ?>
                        <?php foreach ($hourly_stats as $stat): ?>
                            <div><?= sprintf("%02d:00", $stat['hour']) ?> - <?= $stat['count'] ?> emails</div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p>No emails today.</p>
                    <?php endif; ?>
                </div>
                
                <div style="flex: 1; min-width: 250px;">
                    <h4>Top IPs (Last 24h)</h4>
                    <?php if ($top_ips): ?>
                        <?php foreach ($top_ips as $ip_stat): ?>
                            <div>
                                <?= htmlspecialchars($ip_stat['ip']) ?> - <?= $ip_stat['count'] ?> emails
                                <form method="post" style="display: inline; margin-left: 10px;">
                                    <input type="hidden" name="ip_address" value="<?= $ip_stat['ip'] ?>">
                                    <input type="hidden" name="ban_reason" value="High volume sender">
                                    <button type="submit" name="ban_ip" class="btn btn-danger" style="font-size: 12px; padding: 4px 8px;">Ban</button>
                                </form>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p>No recent activity.</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</body>
</html>