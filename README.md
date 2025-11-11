# タスク管理アプリケーション（READMEはAI生成）

TypeScriptのフルスタック型安全性を目指した、ローカル完結型のタスク/進捗管理アプリケーションです。

## 概要

このプロジェクトは、pnpm Workspacesによるモノレпо構成と、オニオンアーキテクチャ（バックエンド）を採用しています。

-   **フロントエンド:** React + Vite (`apps/client`)
-   **バックエンド:** Node.js + Express (`apps/server`)
-   **データベース:** SQLite + Prisma
-   **共有コード:** `@progresso/common` (`packages/common`)

## 前提条件

このプロジェクトを実行するには、[pnpm](https://pnpm.io/installation) がインストールされている必要があります。

## セットアップと実行手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. 依存関係のインストール

プロジェクトのルートディレクトリで以下のコマンドを実行し、すべてのワークスペースに必要なパッケージをインストールします。

```bash
pnpm install
```

### 3. データベースのセットアップ

バックエンドサーバーのデータベースとテーブルをセットアップするために、Prismaのマイグレーションを実行します。

```bash
pnpm --filter server exec prisma migrate dev
```

これにより、`apps/server/prisma/` 内にSQLiteデータベースファイル (`dev.db`) が作成されます。

### 4. アプリケーションの起動

開発サーバーを起動します。バックエンドとフロントエンドをそれぞれ別のターミナルで実行してください。

**ターミナル1: バックエンドサーバーの起動**

```bash
pnpm --filter server dev
```

サーバーは `http://localhost:3001` で起動します。

**ターミナル2: フロントエンドサーバーの起動**

```bash
pnpm --filter client dev
```

フロントエンドは `http://localhost:5173` で起動し、ブラウザでアプリケーションにアクセスできます。