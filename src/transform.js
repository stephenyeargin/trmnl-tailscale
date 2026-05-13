function transform(input) {
  const settings = input?.IDX_0 ?? input?.[0] ?? input?.settings ?? {};
  const rawDevices = input?.IDX_1?.devices ?? input?.[1]?.devices ?? input?.devices ?? [];

  const now = Date.now();
  const onlineThresholdMs = 30 * 60 * 1000;

  const devices = (Array.isArray(rawDevices) ? rawDevices : []).map((device) => {
    const addresses = Array.isArray(device?.addresses) ? device.addresses : [];
    const lastSeen = device?.lastSeen ?? null;
    const lastSeenAt = lastSeen ? Date.parse(lastSeen) : NaN;
    const isOnline = Number.isFinite(lastSeenAt) ? now - lastSeenAt <= onlineThresholdMs : false;

    return {
      name: device?.name ?? "Unknown",
      addresses: addresses.length > 0 ? [addresses[0]] : [],
      lastSeen,
      updateAvailable: Boolean(device?.updateAvailable),
      isOnline
    };
  });

  devices.sort((a, b) => {
    if (a.isOnline !== b.isOnline) {
      return a.isOnline ? 1 : -1;
    }

    return (a.name ?? "").localeCompare(b.name ?? "");
  });

  const online_count = devices.reduce((count, device) => count + (device.isOnline ? 1 : 0), 0);
  const needs_update_count = devices.reduce((count, device) => count + (device.updateAvailable ? 1 : 0), 0);

  return {
    settings,
    devices,
    online_count,
    offline_count: devices.length - online_count,
    needs_update_count
  };
}
