# Node.js 20 버전을 기본 이미지로 사용 (Next.js 16은 Node 20 이상 필요)
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 모든 소스 코드 복사
COPY . .

# Next.js 빌드
RUN npm run build

# 포트 3000 노출
EXPOSE 3000

# 프로덕션 모드로 실행
CMD ["npm", "start"]