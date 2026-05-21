import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        backgroundColor: '#FAFAF8',
        padding: '80px 80px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: '#111827',
          }}
        >
          OASISBIO
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          padding: '0 40px',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '24px',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          Capture Your Identity
        </div>
        <div
          style={{
            fontSize: '24px',
            color: '#4B5563',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          The Proust Questionnaire, reimagined for your identity universe
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: '1px solid #E5E7EB',
          paddingTop: '32px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#111827',
              marginBottom: '8px',
            }}
          >
            OasisBio
          </div>
          <div
            style={{
              fontSize: '16px',
              color: '#6B7280',
            }}
          >
            oasisbio.oasiscompany.org
          </div>
        </div>

        <div
          style={{
            fontSize: '14px',
            color: '#9CA3AF',
          }}
        >
          proust questionnaire
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  )
}
