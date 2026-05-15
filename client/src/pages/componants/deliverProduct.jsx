import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Download, TrendingUp, TrendingDown } from 'lucide-react';

const WideTableComponent = ({ setShowDeliveryHistory, showDeliveryHistory }) => {
  // Generate 86 columns from 5w to 90w
  const columns = Array.from({ length: 86 }, (_, i) => `${i + 5}w`);

  // Generate dummy data for 10 rows
  const generateDummyData = () => {
    const data = [];
    for (let i = 1; i <= 10; i++) {
      const row = {
        id: i,
        name: `Item ${i}`,
        category: ['Electronics', 'Apparel', 'Food', 'Hardware'][i % 4],
      };
      columns.forEach((col) => {
        row[col] = (Math.random() * 100).toFixed(2);
      });
      data.push(row);
    }
    return data;
  };

  const [data] = useState(generateDummyData());
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCol, setHoveredCol] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const filteredData = useMemo(
    () =>
      data.filter((row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [data, searchTerm]
  );

  // Helper to color-code cells based on value
  const getCellStyle = (value) => {
    const num = parseFloat(value);
    if (num >= 75) return { color: '#16a34a', fontWeight: 600 };
    if (num >= 50) return { color: '#0284c7', fontWeight: 500 };
    if (num >= 25) return { color: '#ca8a04', fontWeight: 500 };
    return { color: '#dc2626', fontWeight: 500 };
  };

  // Calculate row totals for summary
  const getRowAverage = (row) => {
    const sum = columns.reduce((acc, col) => acc + parseFloat(row[col]), 0);
    return (sum / columns.length).toFixed(2);
  };

  return (
    <div
      className={`${showDeliveryHistory === 'hidden' ? 'hidden' : 'block'}`}
      style={{
        padding: '24px',
        backgroundColor: '#f9fafb',
        minHeight: '100vh',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowDeliveryHistory('hidden')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 700,
                color: '#111827',
              }}
            >
              Weekly Delivery History
            </h2>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '13px',
                color: '#6b7280',
              }}
            >
              Tracking data from week 5 to week 90
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
              }}
            />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px 8px 34px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                width: '220px',
                backgroundColor: '#fff',
              }}
            />
          </div>

          {/* Export Button */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#4f46e5',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              color: '#fff',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {[
          { label: 'Total Items', value: data.length, color: '#4f46e5' },
          { label: 'Total Weeks', value: columns.length, color: '#0284c7' },
          {
            label: 'Avg Value',
            value: (
              data.reduce(
                (acc, row) => acc + parseFloat(getRowAverage(row)),
                0
              ) / data.length
            ).toFixed(2),
            color: '#16a34a',
          },
          {
            label: 'Date Range',
            value: '5w - 90w',
            color: '#ca8a04',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#fff',
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: 500,
                marginBottom: '4px',
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: stat.color,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            overflowX: 'auto',
            maxWidth: '100%',
            maxHeight: '70vh',
          }}
        >
          <table
            style={{
              borderCollapse: 'separate',
              borderSpacing: 0,
              minWidth: '100%',
              fontSize: '13px',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#f9fafb',
                    position: 'sticky',
                    left: 0,
                    top: 0,
                    zIndex: 3,
                    minWidth: '160px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e5e7eb',
                    borderRight: '2px solid #e5e7eb',
                  }}
                >
                  Item Name
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#f9fafb',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                    minWidth: '90px',
                    textAlign: 'center',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '2px solid #e5e7eb',
                  }}
                >
                  Avg
                </th>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    onMouseEnter={() => setHoveredCol(idx)}
                    onMouseLeave={() => setHoveredCol(null)}
                    style={{
                      padding: '12px 10px',
                      backgroundColor:
                        hoveredCol === idx ? '#eef2ff' : '#f9fafb',
                      whiteSpace: 'nowrap',
                      fontWeight: 600,
                      color: '#374151',
                      borderBottom: '2px solid #e5e7eb',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                      minWidth: '60px',
                      textAlign: 'center',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIdx) => {
                const avg = getRowAverage(row);
                const avgNum = parseFloat(avg);
                return (
                  <tr
                    key={row.id}
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      backgroundColor:
                        hoveredRow === row.id
                          ? '#f8fafc'
                          : rowIdx % 2 === 0
                          ? '#fff'
                          : '#fafafa',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td
                      style={{
                        padding: '12px 16px',
                        backgroundColor:
                          hoveredRow === row.id
                            ? '#f8fafc'
                            : rowIdx % 2 === 0
                            ? '#fff'
                            : '#fafafa',
                        position: 'sticky',
                        left: 0,
                        zIndex: 1,
                        borderBottom: '1px solid #f1f5f9',
                        borderRight: '2px solid #e5e7eb',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: '#eef2ff',
                            color: '#4f46e5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '12px',
                          }}
                        >
                          {row.name.charAt(0)}
                          {row.id}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: '#111827',
                            }}
                          >
                            {row.name}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#9ca3af',
                            }}
                          >
                            {row.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                        borderBottom: '1px solid #f1f5f9',
                        fontWeight: 700,
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          backgroundColor:
                            avgNum >= 50 ? '#dcfce7' : '#fee2e2',
                          color: avgNum >= 50 ? '#16a34a' : '#dc2626',
                          fontSize: '12px',
                        }}
                      >
                        {avgNum >= 50 ? (
                          <TrendingUp size={12} />
                        ) : (
                          <TrendingDown size={12} />
                        )}
                        {avg}
                      </span>
                    </td>
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        style={{
                          padding: '10px 8px',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor:
                            hoveredCol === idx
                              ? 'rgba(79, 70, 229, 0.05)'
                              : 'transparent',
                          transition: 'background-color 0.15s ease',
                          ...getCellStyle(row[col]),
                        }}
                      >
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    style={{
                      padding: '40px',
                      textAlign: 'center',
                      color: '#9ca3af',
                      fontSize: '14px',
                    }}
                  >
                    No items found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
          color: '#6b7280',
        }}
      >
        <div>
          Showing <strong>{filteredData.length}</strong> of{' '}
          <strong>{data.length}</strong> rows ·{' '}
          <strong>{columns.length}</strong> columns
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <LegendDot color="#16a34a" label="≥75" />
          <LegendDot color="#0284c7" label="50-74" />
          <LegendDot color="#ca8a04" label="25-49" />
          <LegendDot color="#dc2626" label="<25" />
        </div>
      </div>
    </div>
  );
};

// Small helper component for the color legend
const LegendDot = ({ color, label }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    <span
      style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: color,
      }}
    />
    {label}
  </span>
);

export default WideTableComponent;