{-# LANGUAGE DeriveAnyClass #-}
{-# LANGUAGE DerivingStrategies #-}
{-# LANGUAGE RecordWildCards #-}

module TypeSafari.Api.Parse where

import Data.Aeson
import GHC.Generics
import Data.Text (Text)
import Prelude

import TypeSafari.HindleyMilner.Parse (parse, ParseResult (..))
import TypeSafari.HindleyMilner.Syntax as Stx

--------------------------------------------------------------------------------

newtype Input = Input {
    inputText :: Text
  }
  deriving stock (Show, Generic)
  deriving anyclass FromJSON

data Output = Output {
    outputExpr :: Maybe LocatedExpr,
    outputError :: Maybe Text
  }
  deriving stock (Generic)
  deriving anyclass ToJSON

--------------------------------------------------------------------------------

runParse :: Input -> IO Output
runParse Input{..} = pure $
  case parse inputText of
    Left err ->
      Output {
        outputExpr = Nothing,
        outputError = Just err
      }
    Right ParseResult{ parsedExpr } ->
      Output {
        outputExpr = Just parsedExpr,
        outputError = Nothing
      }

dispError :: Text -> Output
dispError t =
  Output {
    outputExpr = Nothing,
    outputError = Just t
  }