export type ProustCardOGProps = {
  username: string
  question: string
  answer: string
  displayName: string
  profileUrl: string
  isFallback?: boolean
}

// Satori-compatible serif stack — Georgia is available in Vercel's OG runtime
const SERIF = 'Georgia, "Times New Roman", Times, serif'
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif'

export function ProustCardOG({
  username,
  question,
  answer,
  displayName,
  profileUrl,
  isFallback = false,
}: ProustCardOGProps) {
  // Trim answer to avoid overflow — max ~160 chars for 3-line display at 42px
  const trimmedAnswer = answer.length > 160
    ? answer.slice(0, 157) + '...'
    : answer

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        backgroundColor: '#F8F6F2',
        padding: '72px 80px',
        fontFamily: SANS,
      }}
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Wordmark */}
        <div
          style={{
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: '#1A1A1A',
            fontFamily: SANS,
          }}
        >
          OASISBIO
        </div>
        {/* Rule line */}
        <div
          style={{
            flex: 1,
            height: '1px',
            backgroundColor: '#C8C4BC',
            marginLeft: '20px',
          }}
        />
      </div>

      {/* ── Body ── */}
      {isFallback ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            padding: '0 0',
            marginTop: '56px',
            marginBottom: '56px',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              letterSpacing: '0.18em',
              color: '#888880',
              fontFamily: SANS,
              marginBottom: '32px',
              textTransform: 'uppercase' as const,
            }}
          >
            THE PROUST QUESTIONNAIRE
          </div>
          <div
            style={{
              fontSize: '52px',
              lineHeight: 1.15,
              color: '#1A1A1A',
              fontFamily: SERIF,
              fontWeight: 400,
            }}
          >
            Who are you
            <br />
            across time?
          </div>
          <div
            style={{
              marginTop: '28px',
              fontSize: '20px',
              color: '#666660',
              fontFamily: SANS,
              lineHeight: 1.5,
            }}
          >
            Compile your identity universe.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flex: 1,
            marginTop: '56px',
            marginBottom: '40px',
          }}
        >
          {/* Left accent bar */}
          <div
            style={{
              width: '3px',
              backgroundColor: '#1A1A1A',
              marginRight: '40px',
              borderRadius: '2px',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            {/* Question */}
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.18em',
                color: '#888880',
                fontFamily: SANS,
                marginBottom: '28px',
                textTransform: 'uppercase' as const,
              }}
            >
              {question}
            </div>
            {/* Answer — hero text */}
            <div
              style={{
                fontSize: '42px',
                lineHeight: 1.35,
                color: '#1A1A1A',
                fontFamily: SERIF,
                fontWeight: 400,
              }}
            >
              &ldquo;{trimmedAnswer}&rdquo;
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: '1px solid #C8C4BC',
          paddingTop: '28px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1A1A1A',
              fontFamily: SANS,
              marginBottom: '6px',
            }}
          >
            {isFallback ? 'OasisBio' : displayName}
          </div>
          <div
            style={{
              fontSize: '13px',
              color: '#888880',
              fontFamily: SANS,
              letterSpacing: '0.04em',
            }}
          >
            {isFallback
              ? 'oasisbio.oasiscompany.org'
              : `@${username} · identity universe`}
          </div>
        </div>

        <div
          style={{
            fontSize: '13px',
            color: '#AAAAAA',
            fontFamily: SANS,
            letterSpacing: '0.04em',
          }}
        >
          {isFallback ? 'oasisbio.oasiscompany.org' : profileUrl}
        </div>
      </div>
    </div>
  )
}
