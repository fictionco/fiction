
# Setting Up Local Wildcard Domains on macOS with dnsmasq

## Installation

1. Install dnsmasq:
   ```bash
   brew install dnsmasq
   ```

2. Set Homebrew prefix:
   ```bash
   BREW_PREFIX=$(brew --prefix)
   ```

## Configuration

3. Modify dnsmasq.conf:
   ```bash
   echo "conf-dir=$BREW_PREFIX/etc/dnsmasq.d/,*.conf" >> $BREW_PREFIX/etc/dnsmasq.conf
   ```

4. Create DNS record:
   ```bash
   mkdir -p $BREW_PREFIX/etc/dnsmasq.d
   echo 'address=/lan.com/127.0.0.1' > $BREW_PREFIX/etc/dnsmasq.d/lan.conf
   ```

5. Configure DNS servers:
   - System Preferences > Network > Advanced > DNS
   - Add `127.0.0.1` as first DNS server
   - Move original DNS servers after 127.0.0.1

6. Start dnsmasq:
   ```bash
   sudo brew services restart dnsmasq
   ```

7. Create resolver:
   ```bash
   sudo mkdir -p /etc/resolver
   echo 'nameserver 127.0.0.1' | sudo tee /etc/resolver/lan.com
   ```

8. Flush DNS cache:
   ```bash
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   ```

## Testing

Test with:
```bash
ping test.lan.com
```

Should resolve to 127.0.0.1.

## Note

Replace `lan.com` with your desired local domain.
