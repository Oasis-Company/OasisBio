export type ProustCardOGProps = {
  username: string
  question: string
  answer: string
  displayName: string
  profileUrl: string
  isFallback?: boolean
}

export function ProustCardOG({
  username,
  question,
  answer,
  displayName,
  profileUrl,
  isFallback = false,
}: ProustCardOGProps) {
  return (
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

      {isFallback ? (
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
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            padding: '40px 0',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.2em',
              color: '#6B7280',
              marginBottom: '32px',
            }}
          >
            {question}
          </div>

          <div
            style={{
              fontSize: '44px',
              lineHeight: 1.3,
              color: '#111827',
              fontFamily: 'Georgia, Times New Roman, Times, serif',
              marginBottom: '32px',
              maxHeight: '180px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            "{answer}"
          </div>
        </div>
      )}

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
            {isFallback ? 'OasisBio' : displayName}
          </div>
          {!isFallback && (
            <div
              style={{
                fontSize: '16px',
                color: '#6B7280',
              }}
            >
              @{username} · Their identity universe
            </div>
          )}
          {isFallback && (
            <div
              style={{
                fontSize: '16px',
                color: '#6B7280',
              }}
            >
              oasisbio.oasiscompany.org
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: '14px',
            color: '#9CA3AF',
          }}
        >
          {isFallback ? 'proust questionnaire' : profileUrl}
        </div>
      </div>
    </div>
  )
}
