const WidgetRenderer = React.memo(function WidgetRenderer({ widgetId, type }) {
  const [ready, setReady] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 50 && height > 50) {
        setReady(true);
        observer.disconnect();
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full h-full">
      <div style={{ display: ready ? "block" : "none", width: "100%", height: "100%" }}>
        {type === "KPI" && <KPIWidget widgetId={widgetId} />}
        {type === "BAR" && <BarChartWidget widgetId={widgetId} />}
        {type === "LINE" && <LineChartWidget widgetId={widgetId} />}
        {type === "PIE" && <PieChartWidget widgetId={widgetId} />}
        {type === "AREA" && <AreaChartWidget widgetId={widgetId} />}
        {type === "SCATTER" && <ScatteredChartWidget widgetId={widgetId} />}
      </div>
    </div>
  );
});
